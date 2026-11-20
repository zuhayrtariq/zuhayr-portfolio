// Builds a 3D bust of the cartoon avatar, in two forms:
//
//   public/images/avatar-relief.png   the height of every point, which the footer's bust is
//                                     raised from in the browser (src/components/site/footer-bust.tsx)
//   scripts/assets/zuhayr-bust.glb    the same shape as a model file, for any 3D tool
//
//   node scripts/build-bust.mjs            write both
//   node scripts/build-bust.mjs --preview  also render the model from five angles to .shots/bust.png
//
// One photo holds one side of a head, so this is a relief, not a scan: the front is
// the cartoon pushed out by the depth map that scripts/build-portrait.mjs estimated,
// rounded off at the silhouette, and the back is a plain dark shell. It turns well
// through about 45 degrees either way. Nothing in it is rigged.
import { mkdir, writeFile } from "node:fs/promises";
import sharp from "sharp";

const CLOUD = "public/images/portrait-cloud.png";
const CARTOON = "scripts/assets/avatar-cartoon.png";
const OUT = "scripts/assets/zuhayr-bust.glb";
const RELIEF = "public/images/avatar-relief.png";

// The head-and-shoulders square the cartoon was drawn from, as fractions of the cloud's width.
const BUST = { left: 0.147, top: 0, size: 0.6 };
// Cells along one side of the grid the mesh is cut from.
const N = 224;
const V = N + 1;
// How far the nearest point stands out, and how wide the rounding at the silhouette is,
// both as fractions of the model's width.
const DEPTH = 0.22;
const ROUND = 0.075;
// The back of a head is deeper than its face; the shell is rounded out this much more.
const BACK = 1.9;
const BACK_COLOUR = [0.014, 0.011, 0.009, 1];

/** A Gaussian blur over a V x V field of floats, which keeps the precision an 8-bit image would lose. */
const soften = (field, sigma) => {
  const radius = Math.ceil(sigma * 3);
  const kernel = Array.from({ length: radius * 2 + 1 }, (_, k) => Math.exp(-((k - radius) ** 2) / (2 * sigma * sigma)));
  const total = kernel.reduce((sum, weight) => sum + weight, 0);
  const pass = (source, dx, dy) => {
    const out = new Float32Array(V * V);
    for (let j = 0; j < V; j++) {
      for (let i = 0; i < V; i++) {
        let sum = 0;
        for (let k = -radius; k <= radius; k++) {
          const x = Math.min(V - 1, Math.max(0, i + k * dx));
          const y = Math.min(V - 1, Math.max(0, j + k * dy));
          sum += source[y * V + x] * kernel[k + radius];
        }
        out[j * V + i] = sum / total;
      }
    }
    return out;
  };
  return pass(pass(field, 1, 0), 0, 1);
};

const cloud = await sharp(CLOUD).metadata();
const region = {
  left: Math.round(BUST.left * cloud.width),
  top: Math.round(BUST.top * cloud.width),
  width: Math.round(BUST.size * cloud.width),
  height: Math.round(BUST.size * cloud.width),
};
const channel = (name) => sharp(CLOUD).extract(region).extractChannel(name).resize(V, V, { kernel: "lanczos3" });
// The mask is pulled in a little, as it is for the cartoon, so no background comes along.
const mask = soften(Float32Array.from(await channel("blue").blur(1).linear(2.4, -190).raw().toBuffer()), 1);
// Eight bits of depth would show as terraces on a smooth cheek, and the drop from the jaw to
// the neck would be a cliff that smears the drawing down its face. A blur softens both.
const blurred = soften(Float32Array.from(await channel("green").raw().toBuffer()), 5);
// The estimate spans the whole portrait; here its range is spent on the bust alone.
const levels = [];
for (let n = 0; n < V * V; n++) if (mask[n] > 127) levels.push(blurred[n]);
levels.sort((a, b) => a - b);
const [low, high] = [levels[Math.floor(levels.length * 0.02)], levels[Math.floor(levels.length * 0.995)]];
const depth = Float32Array.from(blurred, (value) => Math.min(1, Math.max(0, (value - low) / (high - low))));

const inside = (i, j) => i >= 0 && j >= 0 && i < V && j < V && mask[j * V + i] > 127;
// Off the edge of the frame counts as more of him, so the shoulders are cut flat, not pinched shut.
const solid = (i, j) => (i < 0 || j < 0 || i >= V || j >= V ? true : mask[j * V + i] > 127);

// Distance from each point to the silhouette, by a two-pass chamfer over the grid.
const far = 1e6;
const dist = new Float32Array(V * V).fill(far);
for (let j = 0; j < V; j++) {
  for (let i = 0; i < V; i++) {
    if (!inside(i, j)) dist[j * V + i] = 0;
    else if (!solid(i - 1, j) || !solid(i + 1, j) || !solid(i, j - 1) || !solid(i, j + 1)) dist[j * V + i] = 0;
  }
}
const relax = (i, j, di, dj, cost) => {
  const x = i + di;
  const y = j + dj;
  if (x < 0 || y < 0 || x >= V || y >= V) return;
  const d = dist[y * V + x] + cost;
  if (d < dist[j * V + i]) dist[j * V + i] = d;
};
for (let j = 0; j < V; j++)
  for (let i = 0; i < V; i++) {
    relax(i, j, -1, 0, 1);
    relax(i, j, 0, -1, 1);
    relax(i, j, -1, -1, Math.SQRT2);
    relax(i, j, 1, -1, Math.SQRT2);
  }
for (let j = V - 1; j >= 0; j--)
  for (let i = V - 1; i >= 0; i--) {
    relax(i, j, 1, 0, 1);
    relax(i, j, 0, 1, 1);
    relax(i, j, 1, 1, Math.SQRT2);
    relax(i, j, -1, 1, Math.SQRT2);
  }

// The silhouette is a staircase at this resolution, and the distances measured from it carry
// every step inward as a ridge. Softened, the rounding comes out as one smooth curve.
const edge = dist.map((d) => d === 0);
const smooth = soften(dist, 2.5);

// The front and back surfaces. Both meet at z = 0 along the silhouette.
const front = new Float32Array(V * V);
const back = new Float32Array(V * V);
const shade = new Float32Array(V * V);
for (let n = 0; n < V * V; n++) {
  const t = edge[n] ? 0 : Math.min(smooth[n] / (ROUND * V), 1);
  // The rounding is steep at the rim, and the drawing stretches down it. It is darkened to
  // ink there, which hides the stretch and reads as the outline a cartoon would have anyway.
  const lit = Math.min(1, t / 0.4);
  shade[n] = 0.1 + 0.9 * lit * lit * (3 - 2 * lit);
  // A quarter circle: steep at the edge, flat once it is a rounding's width inside.
  const round = ROUND * Math.sqrt(1 - (1 - t) * (1 - t));
  front[n] = round + DEPTH * depth[n] * t * t * (3 - 2 * t);
  back[n] = -round * BACK;
}

// A grid can only cut the silhouette in steps. Each point on the edge is slid along the mask's
// slope to where the mask actually crosses its threshold, which turns the steps into a curve.
const outline = (i, j) => {
  if (!edge[j * V + i] || i === 0 || j === 0 || i === N || j === N) return [i, j];
  const at = (x, y) => mask[y * V + x];
  const [gx, gy] = [(at(i + 1, j) - at(i - 1, j)) / 2, (at(i, j + 1) - at(i, j - 1)) / 2];
  const slope = gx * gx + gy * gy;
  if (slope < 1) return [i, j];
  const step = (at(i, j) - 127.5) / slope;
  const clamp = (value) => Math.max(-0.9, Math.min(0.9, value));
  return [i - clamp(step * gx), j - clamp(step * gy)];
};

// For the page: red is the height, as a fraction of the tallest it can be (ROUND + DEPTH,
// which footer-bust.tsx has to agree with), and green is the ink at the rim.
const relief = Buffer.alloc(V * V * 3);
for (let n = 0; n < V * V; n++) {
  relief[n * 3] = Math.round(Math.min(1, front[n] / (ROUND + DEPTH)) * 255);
  relief[n * 3 + 1] = Math.round(shade[n] * 255);
}
const reliefFile = await sharp(relief, { raw: { width: V, height: V, channels: 3 } })
  .resize(256, 256, { kernel: "cubic" })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();
await writeFile(RELIEF, reliefFile);
console.log(`wrote ${RELIEF} (${(reliefFile.length / 1024).toFixed(1)} kB)`);

const positions = [];
const uvs = [];
const colours = [];
const index = { front: new Int32Array(V * V).fill(-1), back: new Int32Array(V * V).fill(-1) };
for (const [side, surface] of [
  ["front", front],
  ["back", back],
]) {
  for (let j = 0; j < V; j++) {
    for (let i = 0; i < V; i++) {
      if (!inside(i, j)) continue;
      index[side][j * V + i] = positions.length / 3;
      const [x, y] = outline(i, j);
      positions.push(x / N - 0.5, 0.5 - y / N, surface[j * V + i]);
      uvs.push(i / N, j / N);
      colours.push(shade[j * V + i], shade[j * V + i], shade[j * V + i]);
    }
  }
}

const triangles = { front: [], back: [] };
for (let j = 0; j < N; j++) {
  for (let i = 0; i < N; i++) {
    if (!(inside(i, j) && inside(i + 1, j) && inside(i, j + 1) && inside(i + 1, j + 1))) continue;
    const corner = (side, di, dj) => index[side][(j + dj) * V + i + di];
    triangles.front.push(corner("front", 0, 0), corner("front", 0, 1), corner("front", 1, 0));
    triangles.front.push(corner("front", 1, 0), corner("front", 0, 1), corner("front", 1, 1));
    triangles.back.push(corner("back", 0, 0), corner("back", 1, 0), corner("back", 0, 1));
    triangles.back.push(corner("back", 1, 0), corner("back", 1, 1), corner("back", 0, 1));
  }
}
// Where he runs off the frame, a wall joins the front to the back.
const wall = (a, b) => {
  if (!inside(...a) || !inside(...b)) return;
  const [fa, fb] = [index.front[a[1] * V + a[0]], index.front[b[1] * V + b[0]]];
  const [ba, bb] = [index.back[a[1] * V + a[0]], index.back[b[1] * V + b[0]]];
  triangles.back.push(fa, ba, fb, fb, ba, bb);
};
for (let n = 0; n < N; n++) {
  wall([n, N], [n + 1, N]);
  wall([0, n + 1], [0, n]);
  wall([N, n], [N, n + 1]);
}

// Smooth normals: each point takes the average of the faces around it.
const normals = new Float32Array(positions.length);
for (const list of Object.values(triangles)) {
  for (let t = 0; t < list.length; t += 3) {
    const [a, b, c] = [list[t] * 3, list[t + 1] * 3, list[t + 2] * 3];
    const u = [positions[b] - positions[a], positions[b + 1] - positions[a + 1], positions[b + 2] - positions[a + 2]];
    const v = [positions[c] - positions[a], positions[c + 1] - positions[a + 1], positions[c + 2] - positions[a + 2]];
    const normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    for (const p of [a, b, c]) for (let k = 0; k < 3; k++) normals[p + k] += normal[k];
  }
}
for (let p = 0; p < normals.length; p += 3) {
  const length = Math.hypot(normals[p], normals[p + 1], normals[p + 2]) || 1;
  for (let k = 0; k < 3; k++) normals[p + k] /= length;
}

const texture = await sharp(CARTOON).removeAlpha().jpeg({ quality: 90, mozjpeg: true }).toBuffer();

// Everything goes into one binary buffer, each part padded to four bytes.
const parts = [];
let length = 0;
const view = (data, target) => {
  const bytes = Buffer.from(data.buffer ?? data, data.byteOffset ?? 0, data.byteLength);
  const entry = { buffer: 0, byteOffset: length, byteLength: bytes.length, ...(target && { target }) };
  const padded = Math.ceil(bytes.length / 4) * 4;
  parts.push(bytes, Buffer.alloc(padded - bytes.length));
  length += padded;
  return entry;
};
const count = positions.length / 3;
// Two bytes address 65,535 points, which is enough at this grid size and halves the index data.
const Indices = count < 65536 ? Uint16Array : Uint32Array;
const bounds = [0, 1, 2].map((k) => {
  let [low, high] = [Infinity, -Infinity];
  for (let p = k; p < positions.length; p += 3) {
    low = Math.min(low, positions[p]);
    high = Math.max(high, positions[p]);
  }
  return [low, high];
});
const bufferViews = [
  view(new Float32Array(positions), 34962),
  view(normals, 34962),
  view(new Float32Array(uvs), 34962),
  view(new Indices(triangles.front), 34963),
  view(new Indices(triangles.back), 34963),
  view(texture),
  view(new Float32Array(colours), 34962),
];
const gltf = {
  asset: { version: "2.0", generator: "scripts/build-bust.mjs" },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: "Zuhayr bust", mesh: 0 }],
  meshes: [
    {
      primitives: [
        { attributes: { POSITION: 0, NORMAL: 1, TEXCOORD_0: 2, COLOR_0: 5 }, indices: 3, material: 0 },
        { attributes: { POSITION: 0, NORMAL: 1 }, indices: 4, material: 1 },
      ],
    },
  ],
  materials: [
    { name: "Cartoon", pbrMetallicRoughness: { baseColorTexture: { index: 0 }, metallicFactor: 0, roughnessFactor: 0.85 } },
    { name: "Back", pbrMetallicRoughness: { baseColorFactor: BACK_COLOUR, metallicFactor: 0, roughnessFactor: 0.9 } },
  ],
  textures: [{ source: 0, sampler: 0 }],
  samplers: [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }],
  images: [{ bufferView: 5, mimeType: "image/jpeg" }],
  accessors: [
    { bufferView: 0, componentType: 5126, count, type: "VEC3", min: bounds.map((b) => b[0]), max: bounds.map((b) => b[1]) },
    { bufferView: 1, componentType: 5126, count, type: "VEC3" },
    { bufferView: 2, componentType: 5126, count, type: "VEC2" },
    { bufferView: 3, componentType: count < 65536 ? 5123 : 5125, count: triangles.front.length, type: "SCALAR" },
    { bufferView: 4, componentType: count < 65536 ? 5123 : 5125, count: triangles.back.length, type: "SCALAR" },
    { bufferView: 6, componentType: 5126, count, type: "VEC3" },
  ],
  bufferViews,
  buffers: [{ byteLength: length }],
};

let json = Buffer.from(JSON.stringify(gltf));
json = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
const bin = Buffer.concat(parts);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546c67, 0);
header.writeUInt32LE(2, 4);
header.writeUInt32LE(12 + 8 + json.length + 8 + bin.length, 8);
const chunk = (type, data) => {
  const head = Buffer.alloc(8);
  head.writeUInt32LE(data.length, 0);
  head.writeUInt32LE(type, 4);
  return Buffer.concat([head, data]);
};
const glb = Buffer.concat([header, chunk(0x4e4f534a, json), chunk(0x004e4942, bin)]);
await mkdir("scripts/assets", { recursive: true });
await writeFile(OUT, glb);
const faces = (triangles.front.length + triangles.back.length) / 3;
console.log(`wrote ${OUT} (${(glb.length / 1024).toFixed(0)} kB, ${count} points, ${faces} triangles)`);

if (process.argv.includes("--preview")) {
  // Rendered by three.js in headless Chrome, from the files already in the repo.
  const { createServer } = await import("node:http");
  const { readFile } = await import("node:fs/promises");
  const { chromium } = await import("playwright-core");
  const types = { ".js": "text/javascript", ".glb": "model/gltf-binary", ".html": "text/html" };
  const page = `<!doctype html><body style="margin:0;background:#0b0c0c">
<script type="importmap">{"imports":{"three":"/node_modules/three/build/three.module.js","three/addons/":"/node_modules/three/examples/jsm/"}}</script>
<script type="module">
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const ANGLES = [-50, -25, 0, 25, 50];
const SIZE = 400;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(SIZE * ANGLES.length, SIZE);
renderer.setScissorTest(true);
document.body.append(renderer.domElement);
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0c0c);
scene.add(new THREE.HemisphereLight(0xffffff, 0x554433, 2.2));
const key = new THREE.DirectionalLight(0xffe2c4, 2.4);
key.position.set(1.5, 1.2, 2.5);
scene.add(key);
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 10);
camera.position.set(0, 0, 2.05);
const { scene: bust } = await new GLTFLoader().loadAsync("/${OUT}");
scene.add(bust);
ANGLES.forEach((angle, n) => {
  bust.rotation.y = (angle * Math.PI) / 180;
  renderer.setViewport(n * SIZE, 0, SIZE, SIZE);
  renderer.setScissor(n * SIZE, 0, SIZE, SIZE);
  renderer.render(scene, camera);
});
document.title = "done";
</script>`;
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, "http://localhost").pathname;
    if (url === "/") return response.writeHead(200, { "Content-Type": "text/html" }).end(page);
    const file = await readFile(`.${url}`).catch(() => null);
    if (!file) return response.writeHead(404).end();
    response.writeHead(200, { "Content-Type": types[url.slice(url.lastIndexOf("."))] ?? "application/octet-stream" }).end(file);
  }).listen(0);
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const tab = await browser.newPage({ viewport: { width: 2000, height: 400 } });
  tab.on("pageerror", (error) => console.log("page error:", error.message));
  await tab.goto(`http://localhost:${server.address().port}/`);
  await tab.waitForFunction(() => document.title === "done", null, { timeout: 30_000 });
  await mkdir(".shots", { recursive: true });
  await tab.screenshot({ path: ".shots/bust.png" });
  await browser.close();
  server.close();
  console.log("wrote .shots/bust.png");
}
