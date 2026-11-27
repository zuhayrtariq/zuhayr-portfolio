// Builds the avatar from the portrait photo, and every icon made from it.
//
//   node scripts/build-avatar.mjs            the cartoon avatar, drawn by scripts/build-cartoon.mjs
//   node scripts/build-avatar.mjs --pixel    the same framing as pixel art
//   add --preview to write a sheet to .shots/avatar-sheet.png instead of the files
//
// Only sharp runs here. The cartoon is read from scripts/assets/avatar-cartoon.png, and the
// pixel art takes its subject mask from the texture scripts/build-portrait.mjs already
// produced (its blue channel), so neither needs a model at this point.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "public/images/me.png";
const CLOUD = "public/images/portrait-cloud.png";
const CARTOON = "scripts/assets/avatar-cartoon.png";
// The same crop build-portrait.mjs uses, as fractions of the source photo.
const CROP = { left: 0.0716, top: 0.2197, width: 1.0286, height: 0.9023 };
// Squares inside that crop, as fractions of its width. BUST is head and shoulders;
// FACE is tighter, for icons too small to spend pixels on shoulders.
const FRAMES = {
  bust: { left: 0.147, top: 0, size: 0.6 },
  face: { left: 0.212, top: 0.01, size: 0.47 },
};

// The page's blue, which the tile behind the avatar is filled with.
const BRAND = [17, 69, 196];
const INK = [11, 12, 12];

/** The cartoon: one drawing, cropped to the frame and scaled to whatever size is asked for. */
const cartoonStyle = async () => {
  const { width } = await sharp(CARTOON).metadata();
  const { bust } = FRAMES;
  return {
    async draw(frame, room) {
      const size = Math.round(room);
      const inner = FRAMES[frame];
      const region = {
        left: Math.round(((inner.left - bust.left) / bust.size) * width),
        top: Math.round(((inner.top - bust.top) / bust.size) * width),
        width: Math.round((inner.size / bust.size) * width),
        height: Math.round((inner.size / bust.size) * width),
      };
      return { size, data: await sharp(CARTOON).extract(region).resize(size, size, { kernel: "lanczos3" }).png().toBuffer() };
    },
    mark: (tile) => tile("face", 128),
  };
};

/** Pixel art: the photo averaged down to a few dozen pixels and a handful of flat colours. */
const pixelStyle = async () => {
  // The avatar's own resolution: 44 pixels square, 16 colours.
  const GRID = 44;
  const COLOURS = 16;

  /** The cut-out `frame` of the photo as raw RGB and a mask, `size` pixels square. */
  const cutout = async (size, frame) => {
    const meta = await sharp(SRC).metadata();
    const cloud = await sharp(CLOUD).metadata();
    const crop = { left: Math.round(CROP.left * meta.width), top: Math.round(CROP.top * meta.height), width: Math.round(CROP.width * meta.width) };
    const side = Math.round(frame.size * crop.width);
    const head = {
      left: crop.left + Math.round(frame.left * crop.width),
      top: crop.top + Math.round(frame.top * crop.width),
      width: side,
      height: side,
    };
    const scale = cloud.width / crop.width;
    const maskRegion = {
      left: Math.round(frame.left * cloud.width),
      top: Math.round(frame.top * cloud.width),
      width: Math.round(side * scale),
      height: Math.round(side * scale),
    };
    const rgb = await sharp(SRC)
      .extract(head)
      .removeAlpha()
      // A little more contrast and colour than the photo, so few pixels still read as a face.
      .modulate({ saturation: 1.25, brightness: 1.06 })
      .linear(1.12, -10)
      .resize(size, size, { kernel: "lanczos3" })
      // Averaging down softens the eyes and brows, which are what make it him.
      .sharpen({ sigma: 0.6, m1: 1.4, m2: 2.2 })
      .raw()
      .toBuffer();
    const mask = await sharp(CLOUD).extract(maskRegion).extractChannel("blue").resize(size, size, { kernel: "lanczos3" }).raw().toBuffer();
    return { rgb, mask };
  };

  /** Median-cut the opaque pixels down to `colours` flat colours. */
  const quantize = async (rgb, mask, size, colours) => {
    const opaque = [];
    for (let i = 0; i < size * size; i++) if (mask[i] > 127) opaque.push(rgb[i * 3], rgb[i * 3 + 1], rgb[i * 3 + 2]);
    const strip = await sharp(Buffer.from(opaque), { raw: { width: opaque.length / 3, height: 1, channels: 3 } })
      .png({ palette: true, colours, dither: 0, effort: 10 })
      .toBuffer();
    const flat = await sharp(strip).removeAlpha().raw().toBuffer();
    const out = Buffer.from(rgb);
    let n = 0;
    for (let i = 0; i < size * size; i++) {
      if (mask[i] <= 127) continue;
      out[i * 3] = flat[n * 3];
      out[i * 3 + 1] = flat[n * 3 + 1];
      out[i * 3 + 2] = flat[n * 3 + 2];
      n++;
    }
    return out;
  };

  /**
   * `grid` x `grid` pixels of RGBA: flat colours, a hard edge, and a one-pixel ink
   * outline around the silhouette, the way a sprite is drawn.
   */
  const sprite = async (grid, colours, frame) => {
    const { rgb, mask } = await cutout(grid, frame);
    const flat = await quantize(rgb, mask, grid, colours);
    const inside = (x, y) => x >= 0 && y >= 0 && x < grid && y < grid && mask[y * grid + x] > 127;
    const out = Buffer.alloc(grid * grid * 4);
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const i = y * grid + x;
        if (inside(x, y)) {
          out.set([flat[i * 3], flat[i * 3 + 1], flat[i * 3 + 2], 255], i * 4);
        } else if (y < grid - 1 && (inside(x - 1, y) || inside(x + 1, y) || inside(x, y - 1) || inside(x, y + 1))) {
          out.set([...INK, 255], i * 4);
        }
      }
    }
    return out;
  };

  const bust = await sprite(GRID, COLOURS, FRAMES.bust);
  return {
    async draw(frame, room) {
      // Small icons are drawn at their own size, one sprite pixel per screen pixel, so nothing is resampled.
      if (frame === "face") {
        const size = Math.round(room);
        const pixels = await sprite(size, size <= 16 ? 8 : size <= 32 ? 12 : 16, FRAMES.face);
        return { size, data: await sharp(pixels, { raw: { width: size, height: size, channels: 4 } }).png().toBuffer() };
      }
      // Whole multiples of the grid keep every pixel the same size. Below the grid's own
      // size there is no such multiple, so the sprite is averaged down instead.
      const size = room >= GRID ? Math.floor(room / GRID) * GRID : Math.round(room);
      const data = await sharp(bust, { raw: { width: GRID, height: GRID, channels: 4 } })
        .resize(size, size, { kernel: room >= GRID ? "nearest" : "lanczos3" })
        .png()
        .toBuffer();
      return { size, data };
    },
    // The 32-pixel favicon at four times, so the header shows the favicon's own pixels.
    mark: async (tile) => sharp(await tile("face", 32)).resize(128, 128, { kernel: "nearest" }).png().toBuffer(),
  };
};

const style = await (process.argv.includes("--pixel") ? pixelStyle() : cartoonStyle());

/** The avatar on a square ground, `size` pixels across. `inset` is the margin as a fraction. */
const tile = async (frame, size, { ground, inset = 0, radius = 0 } = {}) => {
  const art = await style.draw(frame, size * (1 - inset * 2));
  const background = ground ? { r: ground[0], g: ground[1], b: ground[2], alpha: 1 } : { r: 0, g: 0, b: 0, alpha: 0 };
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([
      // He stands on the bottom edge, so the shoulders run off it instead of floating.
      { input: art.data, left: Math.round((size - art.size) / 2), top: size - art.size },
      ...(radius
        ? [
            {
              input: Buffer.from(
                `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${size * radius}" ry="${size * radius}"/></svg>`
              ),
              blend: "dest-in",
            },
          ]
        : []),
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();
};

/** Shrinks an icon's file by drawing it from a palette, which nothing here needs more than. */
const palette = (data) => sharp(data).png({ compressionLevel: 9, palette: true, quality: 95, effort: 10 }).toBuffer();
const webp = (data) => sharp(data).webp({ quality: 90, alphaQuality: 100, effort: 6 }).toBuffer();

/** A .ico holding PNG images, which every current browser reads. */
const ico = (images) => {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const at = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, at);
    header.writeUInt8(size >= 256 ? 0 : size, at + 1);
    header.writeUInt16LE(1, at + 4);
    header.writeUInt16LE(32, at + 6);
    header.writeUInt32LE(data.length, at + 8);
    header.writeUInt32LE(offset, at + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
};

const brand = { ground: BRAND, radius: 0.22 };

// The largest square of the photo that sits on his face, with some room above the hair.
const photo = await sharp(SRC).metadata();
const side = Math.min(photo.width, photo.height);
const within = (value, room) => Math.min(Math.max(0, Math.round(value)), room);
const square = {
  left: within((CROP.left + 0.437 * CROP.width) * photo.width - side / 2, photo.width - side),
  top: within(CROP.top * photo.height - 0.12 * side, photo.height - side),
  width: side,
  height: side,
};
const tiny = Object.fromEntries(await Promise.all([16, 32, 48].map(async (size) => [size, await tile("face", size, brand)])));

const files = {
  // The avatar itself, on nothing, for use in the page: four times its 88 pixels in the footer.
  "public/images/avatar.webp": await webp(await tile("bust", 352)),
  // The same drawing at the size it was drawn, for the badge, where it is the picture on the card.
  "public/images/avatar-large.webp": await webp(await tile("bust", 512)),
  // The mark beside the name in the header.
  "public/images/avatar-mark.webp": await webp(await style.mark((frame, size) => tile(frame, size, brand))),
  // The photo itself at a size a link preview or a search result can use.
  // It is never enlarged: a small photo stays its own size (and src/lib/structured-data.ts says which).
  "public/images/zuhayr-tariq.jpg": await sharp(SRC)
    .extract(square)
    .resize(1200, 1200, { withoutEnlargement: true })
    .flatten({ background: "#0b183d" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer(),
  "src/app/favicon.ico": ico([16, 32, 48].map((size) => ({ size, data: tiny[size] }))),
  "src/app/icon.png": await palette(await tile("bust", 192, brand)),
  // iOS and Android cut their own corners, so these two are full squares.
  "src/app/apple-icon.png": await palette(await tile("bust", 180, { ground: BRAND })),
  "public/icons/icon-192.png": await palette(await tile("bust", 192, brand)),
  "public/icons/icon-512.png": await palette(await tile("bust", 512, brand)),
  "public/icons/icon-maskable-512.png": await palette(await tile("bust", 512, { ground: BRAND, inset: 0.1 })),
};

if (process.argv.includes("--preview")) {
  await mkdir(".shots", { recursive: true });
  const tiles = [];
  let left = 16;
  for (const [name, data] of Object.entries(files)) {
    if (!/\.(png|webp)$/.test(name)) continue;
    const { width } = await sharp(data).metadata();
    const shown = Math.min(width, 256);
    tiles.push({ input: await sharp(data).resize(shown, shown).png().toBuffer(), left, top: 16 });
    left += shown + 16;
  }
  for (const size of [16, 32, 48]) {
    tiles.push({ input: tiny[size], left, top: 16 });
    // And each again at four times, to see what the browser tab is actually given.
    tiles.push({ input: await sharp(tiny[size]).resize(size * 4, size * 4, { kernel: "nearest" }).toBuffer(), left, top: 80 });
    left += size * 4 + 16;
  }
  await sharp({ create: { width: left, height: 288, channels: 3, background: "#1b1c1c" } })
    .composite(tiles)
    .png()
    .toFile(".shots/avatar-sheet.png");
  console.log("wrote .shots/avatar-sheet.png");
} else {
  await mkdir("public/icons", { recursive: true });
  for (const [name, data] of Object.entries(files)) {
    await writeFile(name, data);
    console.log(`wrote ${name} (${(data.length / 1024).toFixed(1)} kB)`);
  }
}
