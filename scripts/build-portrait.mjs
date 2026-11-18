// Builds the data texture behind the hero's point-cloud portrait.
//
//   R = brightness of the point, G = depth (255 is nearest the camera), B = subject mask
//
// It also writes the graded still shown in its place where there is no GPU.
//
// Depth comes from Depth Anything V2 and the mask from MODNet, both run once here,
// so the site ships two small images and no model. The tooling is not a project
// dependency; run it from a scratch directory:
//
//   mkdir /tmp/portrait-build && cd /tmp/portrait-build
//   npm init -y && npm install @huggingface/transformers sharp
//   cp <repo>/scripts/build-portrait.mjs . && node build-portrait.mjs <repo>

import { pipeline, RawImage } from "@huggingface/transformers";
import path from "node:path";
import sharp from "sharp";

const repo = path.resolve(process.argv[2] ?? ".");
const SRC = path.join(repo, "public/images/me.png");
const OUT = path.join(repo, "public/images/portrait-cloud.png");
const STILL = path.join(repo, "public/images/portrait-still.webp");

// Head, shoulders and chest, as fractions of the source photo.
const CROP = { left: 0.15, top: 0.1, width: 0.75, height: 0.64 };
const W = 512;

const meta = await sharp(SRC).metadata();
const region = {
  left: Math.round(CROP.left * meta.width),
  top: Math.round(CROP.top * meta.height),
  width: Math.round(CROP.width * meta.width),
  height: Math.round(CROP.height * meta.height),
};
const H = Math.round((W * region.height) / region.width);
const cropPath = "/tmp/portrait-build/crop.png";
await sharp(SRC).extract(region).resize(W, H).png().toFile(cropPath);
const image = await RawImage.read(cropPath);

console.log(`crop ${W}x${H}; estimating depth`);
const depthPipe = await pipeline("depth-estimation", "onnx-community/depth-anything-v2-small");
const { depth } = await depthPipe(image);
if (depth.width !== W || depth.height !== H) throw new Error("depth map size differs from the crop");
const depthRaw = depth.data;

console.log("cutting out the subject");
const matte = await pipeline("background-removal", "Xenova/modnet");
const result = await matte(image);
const cut = Array.isArray(result) ? result[0] : result;
const rgba = await sharp(Buffer.from(cut.data), {
  raw: { width: cut.width, height: cut.height, channels: cut.channels },
})
  .resize(W, H, { fit: "fill" })
  .ensureAlpha()
  .raw()
  .toBuffer();

const grey = await sharp(cropPath).greyscale().raw().toBuffer();

// Normalise depth inside the mask so the full range is spent on the subject.
let near = 0;
let far = 255;
{
  const inside = [];
  for (let i = 0; i < W * H; i++) if (rgba[i * 4 + 3] > 128) inside.push(depthRaw[i]);
  inside.sort((a, b) => a - b);
  far = inside[Math.floor(inside.length * 0.01)];
  near = inside[Math.floor(inside.length * 0.995)];
}

const out = Buffer.alloc(W * H * 3);
const alphaAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : rgba[(y * W + x) * 4 + 3]);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const mask = rgba[i * 4 + 3];
    const luma = Math.pow(grey[i] / 255, 0.72);
    // A dim rim along the silhouette keeps dark hair and the sweater readable on black,
    // without bleaching the edge of the face.
    const edge = Math.max(0, mask - Math.min(alphaAt(x - 4, y), alphaAt(x + 4, y), alphaAt(x, y - 4), alphaAt(x, y + 4))) / 255;
    const brightness = Math.max(0.07 + luma * 0.93, edge * 0.5);
    const d = Math.min(1, Math.max(0, (depthRaw[i] - far) / (near - far)));
    out[i * 3] = Math.round(brightness * 255);
    out[i * 3 + 1] = Math.round(d * 255);
    out[i * 3 + 2] = mask;
  }
}

await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`wrote ${path.relative(repo, OUT)} (${W}x${H})`);

// The still shown where WebGL has no GPU behind it: the same cut-out, graded with
// the cloud's colour ramp, so the frame looks the same whether or not it moves.
const SW = 820;
const SH = Math.round((SW * H) / W);
const big = await sharp(SRC).extract(region).resize(SW, SH).greyscale().raw().toBuffer({ resolveWithObject: true });
const alpha = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) alpha[i] = rgba[i * 4 + 3];
const bigMask = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } })
  .resize(SW, SH)
  .toColourspace("b-w")
  .raw()
  .toBuffer({ resolveWithObject: true });

const RAMP = [
  [0.0, [0.13, 0.06, 0.035]],
  [0.16, [0.72, 0.3, 0.14]],
  [0.52, [0.94, 0.76, 0.54]],
  [0.92, [0.96, 0.95, 0.91]],
];
const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const ramp = (g) => {
  for (let k = RAMP.length - 1; k > 0; k--) {
    if (g >= RAMP[k - 1][0]) {
      const t = Math.min(1, (g - RAMP[k - 1][0]) / (RAMP[k][0] - RAMP[k - 1][0]));
      return RAMP[k - 1][1].map((c, n) => c + (RAMP[k][1][n] - c) * t);
    }
  }
  return RAMP[0][1];
};
const still = Buffer.alloc(SW * SH * 4);
for (let y = 0; y < SH; y++) {
  for (let x = 0; x < SW; x++) {
    const i = y * SW + x;
    const luma = Math.pow(big.data[i * big.info.channels] / 255, 0.72);
    const glow = Math.pow(smooth(0.2, 1, 0.07 + luma * 0.93), 1.7);
    const [r, g, b] = ramp(glow);
    const fade = 1 - smooth(0.7, 0.99, y / SH);
    still[i * 4] = Math.round(r * 255);
    still[i * 4 + 1] = Math.round(g * 255);
    still[i * 4 + 2] = Math.round(b * 255);
    still[i * 4 + 3] = Math.round(bigMask.data[i * bigMask.info.channels] * fade);
  }
}
await sharp(still, { raw: { width: SW, height: SH, channels: 4 } }).webp({ quality: 78 }).toFile(STILL);
console.log(`wrote ${path.relative(repo, STILL)} (${SW}x${SH})`);
