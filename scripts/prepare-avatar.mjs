// Compresses an Avaturn export for the web and checks it can lip-sync.
// Usage: npm run avatar -- <path/to/avatar.glb> [public/avatar/zuhayr.glb]
import { execFileSync } from "node:child_process";
import { readFileSync, statSync } from "node:fs";

const [input, output = "public/avatar/zuhayr.glb"] = process.argv.slice(2);
if (!input) {
  console.error("Usage: npm run avatar -- <path/to/avatar.glb> [output.glb]");
  process.exit(1);
}

/** Reads the morph target names from a GLB's JSON chunk. */
const morphTargets = (file) => {
  const buf = readFileSync(file);
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error(`${file} is not a .glb file`);
  const jsonLength = buf.readUInt32LE(12);
  const gltf = JSON.parse(buf.subarray(20, 20 + jsonLength).toString("utf8"));
  return new Set((gltf.meshes ?? []).flatMap((m) => m.extras?.targetNames ?? []));
};

const mb = (file) => (statSync(file).size / 1024 / 1024).toFixed(1);

const before = morphTargets(input);
const visemes = [...before].filter((n) => n.startsWith("viseme_")).length;
const arkit = ["jawOpen", "eyeBlinkLeft", "mouthFunnel", "mouthSmileLeft"].filter((n) => before.has(n)).length;
console.log(`Input: ${mb(input)} MB, ${before.size} face shapes (${visemes} visemes, ${arkit}/4 ARKit checks)`);
if (arkit < 4) {
  console.error(
    "This avatar has no animatable face (ARKit blend shapes), so it can't lip-sync.\n" +
      "Re-export it from Avaturn as the T2 type (with blend shapes) and try again."
  );
  process.exit(1);
}

// Keep the skeleton and meshes as they are; only compress geometry and textures.
execFileSync(
  "npx",
  [
    "-y",
    "@gltf-transform/cli@4",
    "optimize",
    input,
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

const after = morphTargets(output);
const lost = [...before].filter((n) => !after.has(n));
console.log(`\nOutput: ${output}, ${mb(output)} MB, ${after.size} face shapes kept`);
if (lost.length) console.warn(`Warning: ${lost.length} face shapes were lost: ${lost.slice(0, 8).join(", ")}`);
console.log(`Set NEXT_PUBLIC_AVATAR_URL=/${output.replace(/^public\//, "")} in .env.local and on Vercel.`);
