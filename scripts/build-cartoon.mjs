// Draws the cartoon avatar from the portrait photo, as a cut-out that
// scripts/build-avatar.mjs turns into the favicon, the app icons and the site's avatar.
//
// The drawing is done by a small image-to-image model, run once here, so the site
// ships a picture and no model. The tooling is not a project dependency; run it
// from a scratch directory:
//
//   mkdir -p /tmp/avatar-build && cd /tmp/avatar-build
//   npm init -y && npm install onnxruntime-node sharp
//   cp <repo>/scripts/build-cartoon.mjs . && node build-cartoon.mjs <repo> [paint|ghibli]
//   cd <repo> && node scripts/build-avatar.mjs
//
// Two looks are wired in. Mind the licences: they differ.
//
//   paint   AnimeGANv2 "face paint" by bryandlee (MIT). An inked, illustrated portrait.
//   ghibli  AnimeGANv3 by Asher Chan. Smoother and rounder, but its licence covers
//           non-commercial use only; commercial use needs the author's permission.

import * as ort from "onnxruntime-node";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const STYLES = {
  paint: {
    url: "https://huggingface.co/akhaliq/AnimeGANv2-ONNX/resolve/main/face_paint_512_v2_0.onnx",
    layout: "nchw",
    // Lightly smoothed first, the model draws clean skin instead of inking in the grain.
    prepare: (image) => image.median(3),
    // It draws skin a little grey; this puts the warmth back.
    finish: (image) => image.modulate({ saturation: 1.35, brightness: 1.05 }),
  },
  ghibli: {
    url: "https://huggingface.co/trysem/AnimeGANv3_Portrait_Inference/resolve/main/AnimeGANv3_large_Ghibli_c1_e299.onnx",
    layout: "nhwc",
    prepare: (image) => image,
    finish: (image) => image,
  },
};

const repo = path.resolve(process.argv[2] ?? ".");
const name = process.argv[3] ?? "paint";
const style = STYLES[name];
if (!style) throw new Error(`Unknown style "${name}". Use one of: ${Object.keys(STYLES).join(", ")}`);

const SRC = path.join(repo, "public/images/me.png");
const CLOUD = path.join(repo, "public/images/portrait-cloud.png");
const OUT = path.join(repo, "scripts/assets/avatar-cartoon.png");

// The crop build-portrait.mjs uses, as fractions of the photo, and the head-and-shoulders
// square inside it, as fractions of that crop's width. build-avatar.mjs frames the same square.
const CROP = { left: 0.0716, top: 0.2197, width: 1.0286 };
const BUST = { left: 0.147, top: 0, size: 0.6 };
// Both models were trained on 512-pixel faces, and draw best at that size.
const S = 512;

const model = path.join("models", `${name}.onnx`);
if (!(await stat(model).catch(() => null))) {
  console.log(`downloading the ${name} model`);
  const response = await fetch(style.url);
  if (!response.ok) throw new Error(`Could not download ${style.url}: ${response.status}`);
  await mkdir("models", { recursive: true });
  await writeFile(model, Buffer.from(await response.arrayBuffer()));
}

const photo = await sharp(SRC).metadata();
const cropWidth = CROP.width * photo.width;
const side = Math.round(BUST.size * cropWidth);
const region = {
  left: Math.round(CROP.left * photo.width + BUST.left * cropWidth),
  top: Math.round(CROP.top * photo.height + BUST.top * cropWidth),
  width: side,
  height: side,
};
const rgb = await style.prepare(sharp(SRC).extract(region).removeAlpha().resize(S, S)).raw().toBuffer();

// Both models take and return colours from -1 to 1; they differ in where the channels sit.
const at = (i, c) => (style.layout === "nchw" ? c * S * S + i : i * 3 + c);
const input = new Float32Array(S * S * 3);
for (let i = 0; i < S * S; i++) for (let c = 0; c < 3; c++) input[at(i, c)] = rgb[i * 3 + c] / 127.5 - 1;

console.log("drawing");
const session = await ort.InferenceSession.create(model);
const dims = style.layout === "nchw" ? [1, 3, S, S] : [1, S, S, 3];
const result = await session.run({ [session.inputNames[0]]: new ort.Tensor("float32", input, dims) });
const drawn = result[session.outputNames[0]].data;

// The subject mask is the blue channel of the texture build-portrait.mjs already made.
// It is pulled in by a couple of pixels, so none of the background comes along at the edge.
const cloud = await sharp(CLOUD).metadata();
const mask = await sharp(CLOUD)
  .extract({
    left: Math.round(BUST.left * cloud.width),
    top: Math.round(BUST.top * cloud.width),
    width: Math.round(BUST.size * cloud.width),
    height: Math.round(BUST.size * cloud.width),
  })
  .extractChannel("blue")
  .resize(S, S)
  .blur(2)
  .linear(2.4, -190)
  .raw()
  .toBuffer();

const out = Buffer.alloc(S * S * 4);
for (let i = 0; i < S * S; i++) {
  for (let c = 0; c < 3; c++) out[i * 4 + c] = Math.max(0, Math.min(255, Math.round((drawn[at(i, c)] + 1) * 127.5)));
  out[i * 4 + 3] = mask[i];
}
await mkdir(path.dirname(OUT), { recursive: true });
await style
  .finish(sharp(out, { raw: { width: S, height: S, channels: 4 } }))
  .png({ compressionLevel: 9 })
  .toFile(OUT);
console.log(`wrote ${path.relative(repo, OUT)} (${S}x${S}, ${name})`);
