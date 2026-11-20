// Compresses an avatar export (Avaturn T2 or Avatar SDK MetaPerson) for the web and checks it can lip-sync.
// Usage: npm run avatar -- <path/to/avatar.glb> [public/avatar/zuhayr.glb]
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const [input, output = "public/avatar/zuhayr.glb"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: npm run avatar -- <path/to/avatar.glb> [output.glb]");
  process.exit(1);
}

const GLB_MAGIC = 0x46546c67;

/** Splits a GLB into its JSON document and the bytes that follow the JSON chunk. */
const readGlb = (file) => {
  const buf = readFileSync(file);
  if (buf.readUInt32LE(0) !== GLB_MAGIC) throw new Error(`${file} is not a .glb file`);
  const jsonLength = buf.readUInt32LE(12);
  return {
    gltf: JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8")),
    rest: buf.subarray(20 + jsonLength),
  };
};

/** Writes a GLB from a JSON document and the untouched binary chunk(s). */
const writeGlb = (file, gltf, rest) => {
  let json = Buffer.from(JSON.stringify(gltf), "utf8");
  // Chunks are 4-byte aligned; JSON is padded with spaces.
  if (json.length % 4) json = Buffer.concat([json, Buffer.alloc(4 - (json.length % 4), 0x20)]);
  const header = Buffer.alloc(20);
  header.writeUInt32LE(GLB_MAGIC, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(20 + json.length + rest.length, 8);
  header.writeUInt32LE(json.length, 12);
  header.writeUInt32LE(0x4e4f534a, 16);
  writeFileSync(file, Buffer.concat([header, json, rest]));
};

const morphTargets = (gltf) => new Set((gltf.meshes ?? []).flatMap((m) => m.extras?.targetNames ?? []));

// Avatar SDK names its mouth shapes without the `viseme_` prefix the runtime looks up,
// and calls its root `AvatarRoot` where the runtime expects `Armature`.
const AVATAR_SDK_VISEMES = {
  sil: "viseme_sil", PP: "viseme_PP", FF: "viseme_FF", TH: "viseme_TH", DD: "viseme_DD",
  kk: "viseme_kk", CH: "viseme_CH", SS: "viseme_SS", nn: "viseme_nn", RR: "viseme_RR",
  aa: "viseme_aa", E: "viseme_E", ih: "viseme_I", oh: "viseme_O", ou: "viseme_U",
};

/** Renames Avatar SDK shapes and root in place. Returns how many names changed. */
const renameAvatarSdk = (gltf) => {
  let renamed = 0;
  for (const mesh of gltf.meshes ?? []) {
    const names = mesh.extras?.targetNames;
    if (!names) continue;
    mesh.extras.targetNames = names.map((n) => {
      if (!Object.hasOwn(AVATAR_SDK_VISEMES, n)) return n;
      renamed++;
      return AVATAR_SDK_VISEMES[n];
    });
  }
  const nodes = gltf.nodes ?? [];
  if (!nodes.some((n) => n.name === "Armature")) {
    const root = nodes.find((n) => n.name === "AvatarRoot");
    if (root) {
      root.name = "Armature";
      renamed++;
    }
  }
  return renamed;
};

const mb = (file) => (statSync(file).size / 1024 / 1024).toFixed(1);

const { gltf, rest } = readGlb(input);
const renamed = renameAvatarSdk(gltf);
const before = morphTargets(gltf);
const visemes = [...before].filter((n) => n.startsWith("viseme_")).length;
const arkit = ["jawOpen", "eyeBlinkLeft", "mouthFunnel", "mouthSmileLeft"].filter((n) => before.has(n)).length;
console.log(
  `Input: ${mb(input)} MB, ${before.size} face shapes (${visemes} visemes, ${arkit}/4 ARKit checks)` +
    (renamed ? `, ${renamed} Avatar SDK names converted` : "")
);
if (arkit < 4) {
  console.error(
    "This avatar has no animatable face (ARKit blend shapes), so it can't lip-sync.\n" +
      "Re-export it with blend shapes (Avaturn: the T2 type; MetaPerson: GLB with blendshapes on) and try again."
  );
  process.exit(1);
}
if (visemes < 10) {
  console.warn(`Warning: only ${visemes} viseme shapes found, so lip-sync will fall back to jaw movement.`);
}

const work = mkdtempSync(path.join(tmpdir(), "avatar-"));
const source = renamed ? path.join(work, "renamed.glb") : input;
if (renamed) writeGlb(source, gltf, rest);

try {
  // Keep the skeleton and meshes as they are; only compress geometry and textures.
  execFileSync(
    "npx",
    [
      "-y",
      "@gltf-transform/cli@4",
      "optimize",
      source,
      output,
      "--compress", "meshopt",
      "--texture-compress", "webp",
      "--texture-size", "1024",
      "--simplify", "false",
      "--join", "false",
      "--flatten", "false",
      "--instance", "false",
    ],
    { stdio: "inherit" }
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}

const after = morphTargets(readGlb(output).gltf);
const lost = [...before].filter((n) => !after.has(n));
console.log(`\nOutput: ${output}, ${mb(output)} MB, ${after.size} face shapes kept`);
if (lost.length) console.warn(`Warning: ${lost.length} face shapes were lost: ${lost.slice(0, 8).join(", ")}`);
console.log(`Set NEXT_PUBLIC_AVATAR_URL=/${output.replace(/^public\//, "")} in .env.local and on Vercel.`);
