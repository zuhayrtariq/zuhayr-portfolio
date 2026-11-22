import * as THREE from "three";

/**
 * The flight behind the first screens of the home page, drawn live.
 *
 * It is four passes on one canvas, all seen through one camera:
 *   1. the sky, the ground and a layer of volumetric cloud, ray-marched at about half
 *      resolution (soft things survive being scaled up);
 *   2. the airport's lights, as points on the ground;
 *   3. the aircraft, a paper plane that becomes an airliner inside the first cloud;
 *   4. a veil of cloud over everything while the camera is inside the layer.
 *
 * Distances are in kilometres. The camera never leaves x = 0, z = 0: the air and the
 * airport move past it instead.
 *
 * Scroll decides where in the flight we are (`setProgress`, 0 to 1). Time only moves the
 * air: the cloud drifting past, the wings rocking, the strobes.
 */

export interface FlightHandle {
  /** Where in the flight we are: 0 is the paper plane at dawn, 1 is rolling out on the runway. */
  setProgress(progress: number): void;
  /** The pointer, from -1 to 1 on both axes, y down. The aircraft leans toward it. */
  setPointer(x: number, y: number): void;
  /** Stops the loop while the stage is off screen. */
  setActive(active: boolean): void;
  resize(): void;
  dispose(): void;
}

export interface FlightOptions {
  /** Phones get a cheaper cloud and a centred aircraft. */
  compact: boolean;
  /** Draw single frames on demand instead of running a loop (reduced motion). */
  still: boolean;
  /** Raises the aircraft in a tall frame, for a page that needs the lower half for something else. */
  lift?: number;
  onFirstFrame?: () => void;
  onLost?: () => void;
}

/* ───────────────────────── the flight plan ───────────────────────── */

type Key = readonly [number, number];
type Rgb = readonly [number, number, number];

const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** A value along the flight, eased between its keyframes. */
const along = (keys: readonly Key[], p: number) => {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const [p0, v0] = keys[i - 1];
      const [p1, v1] = keys[i];
      return lerp(v0, v1, smooth((p - p0) / (p1 - p0)));
    }
  }
  return keys[keys.length - 1][1];
};

const hex = (value: string): Rgb => {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/** The cloud layer sits between these heights; the ground is far below it. */
const CLOUD_BASE = 0;
const CLOUD_TOP = 1.3;
const GROUND = -3;
/** Model units to kilometres: the airliner is drawn six units long and flies 42 metres long. */
const AIRLINER_SCALE = 0.007;
const PAPER_SCALE = 0.0155;
/** How far the wheels hang below the airliner's centre line. */
const GEAR = 0.82 * AIRLINER_SCALE;
/** How far ahead of the camera the aircraft flies. */
const AHEAD = 0.095;
/** How far left of the runway the camera looks on final approach on a wide screen, in radians. */
const APPROACH_GLANCE = 0.17;

/** Where the paper plane hands over to the airliner, and where day hands over to dusk: both inside cloud. */
export const SWAP_AT = 0.305;

/** The camera's height. The last key is under the runway: the wheels stop the descent, not the curve. */
const ALTITUDE: Key[] = [
  [0, 1.4],
  [0.2, 1.36],
  [0.27, 0.86],
  [0.305, 0.55],
  [0.345, 0.95],
  [0.43, 2.3],
  [0.62, 2.55],
  [0.7, 2.1],
  [0.755, 0.55],
  [0.8, -0.85],
  [0.87, -1.95],
  [0.95, GROUND - 0.02],
  [1, GROUND - 0.02],
];

/** Camera pitch in degrees: about level over the cloud tops, up in the climb, down on the way in. */
const PITCH: Key[] = [
  [0, -1.5],
  [0.25, -6],
  [0.33, 5],
  [0.43, -5],
  [0.62, -9],
  [0.72, -13],
  [0.8, -8],
  [0.9, -5],
  [0.945, -3.5],
  [1, -3],
];

/**
 * How far the aircraft's heading is from where the camera looks, in radians (negative is to
 * the right). Early on we watch it from behind its left wing, flying into the sunrise; by the
 * approach we are straight behind it.
 */
const HEADING: Key[] = [
  [0, -0.5],
  [0.25, -0.44],
  [0.45, -0.34],
  [0.66, -0.3],
  [0.8, -0.1],
  [0.86, 0],
  [1, 0],
];

/** The aircraft's own nose-up angle: up in the climb, down on the way in, up again for the flare. */
const ATTITUDE: Key[] = [
  [0, 0.03],
  [0.27, -0.12],
  [0.33, 0.24],
  [0.43, 0.05],
  [0.64, 0.0],
  [0.72, -0.1],
  [0.88, -0.04],
  [0.93, 0.08],
  [0.96, 0.0],
  [1, 0.0],
];

/**
 * How fast the cloud goes by, in kilometres a second of real time: a drift for the paper
 * plane, and several times that for the airliner. (The ground comes up with the scroll instead.)
 */
const AIRSPEED: Key[] = [
  [0, 0.15],
  [0.26, 0.2],
  [0.34, 0.5],
  [0.45, 0.62],
  [0.7, 0.62],
  [0.85, 0.45],
  [0.945, 0.3],
  [1, 0.06],
];

/** Kilometres to the runway threshold. Negative once we are past it and rolling out. */
const TO_THRESHOLD: Key[] = [
  [0.76, 9.5],
  [0.86, 5],
  [0.945, 0.05],
  [1, -1.5],
];

/** Sun elevation in degrees. It is up by the cruise and just gone by the landing. */
const SUN_ELEVATION: Key[] = [
  [0, 5],
  [0.22, 8.5],
  [0.44, 33],
  [0.64, 40],
  [0.72, 16],
  [0.79, 2],
  [0.88, -2],
  [1, -4],
];

/** 0 is dawn, 1 is day, 2 is dusk. */
const TIME_OF_DAY: Key[] = [
  [0, 0],
  [0.24, 0.08],
  [0.44, 1],
  [0.66, 1],
  [0.79, 2],
  [1, 2],
];

const SUN_AZIMUTH = (21 * Math.PI) / 180;

interface Light {
  zenith: Rgb;
  /** The sky a third of the way up, which keeps the warm horizon from muddying the blue above it. */
  mid: Rgb;
  horizon: Rgb;
  sun: Rgb;
  ambient: Rgb;
  lit: Rgb;
  shade: Rgb;
  ground: Rgb;
}

/** Dawn, day and dusk. Shadows are tinted cobalt so the whole flight stays in the page's palette. */
const LIGHT: Light[] = [
  {
    zenith: hex("#0a1a78"),
    mid: hex("#4f6fe8"),
    horizon: hex("#ffcf96"),
    sun: [1.0, 0.76, 0.42],
    ambient: [0.4, 0.46, 0.86],
    lit: hex("#fff4e4"),
    shade: hex("#3147cf"),
    ground: hex("#3349b8"),
  },
  {
    zenith: hex("#0b27b4"),
    mid: hex("#3c68ee"),
    horizon: hex("#b4cfff"),
    sun: [1.0, 0.97, 0.9],
    ambient: [0.56, 0.63, 0.93],
    lit: hex("#ffffff"),
    shade: hex("#6f89ea"),
    ground: hex("#5b80dd"),
  },
  {
    zenith: hex("#040b26"),
    mid: hex("#2a2a66"),
    horizon: hex("#ff7a42"),
    sun: [1.0, 0.5, 0.24],
    ambient: [0.13, 0.15, 0.33],
    lit: hex("#9a8fc4"),
    shade: hex("#0a1340"),
    ground: hex("#040a1e"),
  },
];

const mixLight = (time: number, key: keyof Light, out: THREE.Vector3) => {
  const i = Math.min(1, Math.floor(time));
  const t = clamp(time - i);
  const a = LIGHT[i][key];
  const b = LIGHT[i + 1][key];
  return out.set(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));
};

/* ───────────────────────── shaders ───────────────────────── */

const FULLSCREEN_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const SKY_FRAGMENT = /* glsl */ `
  uniform sampler2D uNoise;
  uniform mat3 uCamera;
  uniform float uAltitude;
  uniform float uTanHalf;
  uniform float uAspect;
  uniform float uTime;
  uniform vec2 uTravel;
  uniform float uSteps;
  uniform vec3 uSunDir;
  uniform vec3 uSun;
  uniform vec3 uZenith;
  uniform vec3 uMid;
  uniform vec3 uHorizon;
  uniform vec3 uAmbient;
  uniform vec3 uLit;
  uniform vec3 uShade;
  uniform vec3 uGround;
  uniform float uRim;
  uniform float uStars;
  uniform float uThreshold;
  uniform float uAirport;
  uniform float uLanding;
  uniform vec2 uPool;
  varying vec2 vUv;

  const float BASE = ${CLOUD_BASE.toFixed(1)};
  const float TOP = ${CLOUD_TOP.toFixed(1)};
  const float GROUND = ${GROUND.toFixed(1)};
  const float FAR = 70.0;

  float hash(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * 0.1031);
    q += dot(q, q.yzx + 33.33);
    return fract((q.x + q.y) * q.z);
  }

  // Value noise in three dimensions out of one 2D lookup: the texture's green channel
  // is its red channel shifted by (37, 17), so two neighbouring slices come back at once.
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = textureLod(uNoise, (uv + 0.5) / 256.0, 0.0).yx;
    return mix(rg.x, rg.y, f.z);
  }

  float fbm(vec3 p, int octaves) {
    float sum = 0.0;
    float gain = 0.5;
    for (int i = 0; i < 5; i++) {
      if (i >= octaves) break;
      sum += gain * noise(p);
      p = p * 2.4 + vec3(0.0, 0.13, 0.0);
      gain *= 0.5;
    }
    return sum;
  }

  // A sea of cloud: full near its floor, carved into towers toward the top.
  float density(vec3 p, int octaves) {
    float h = (p.y - BASE) / (TOP - BASE);
    if (h <= 0.0 || h >= 1.0) return 0.0;
    vec3 q = vec3(p.x + uTravel.x, p.y * 1.25, p.z + uTravel.y) * 0.46;
    float f = fbm(q, octaves);
    float d = 1.9 * f - 0.5 - 1.08 * h;
    d *= smoothstep(0.0, 0.14, h);
    return clamp(d, 0.0, 1.0);
  }

  // The sky without the sun's disc: also the colour that distance fades everything toward.
  vec3 airColor(vec3 rd) {
    float up = clamp(rd.y, 0.0, 1.0);
    vec3 col = mix(uHorizon, uMid, smoothstep(0.0, 0.2, up));
    col = mix(col, uZenith, smoothstep(0.1, 0.7, up));
    float toSun = max(dot(rd, uSunDir), 0.0);
    return col + uSun * 0.22 * pow(toSun, 5.0);
  }

  vec3 skyColor(vec3 rd) {
    float toSun = max(dot(rd, uSunDir), 0.0);
    vec3 col = airColor(rd) + uSun * 0.55 * pow(toSun, 90.0);
    float disc = smoothstep(0.99952, 0.99966, toSun);
    return mix(col, max(col, vec3(1.0, 0.95, 0.74)), disc);
  }

  void main() {
    vec2 ndc = vUv * 2.0 - 1.0;
    vec3 rd = normalize(uCamera * vec3(ndc.x * uTanHalf * uAspect, ndc.y * uTanHalf, -1.0));
    vec3 ro = vec3(0.0, uAltitude, 0.0);

    vec3 level = normalize(vec3(rd.x, 0.0, rd.z));
    vec3 haze = airColor(level)
      + uSun * 0.55 * pow(max(dot(level, uSunDir), 0.0), 90.0) * smoothstep(-0.3, 0.0, rd.y);
    vec3 bg = skyColor(rd);

    if (uStars > 0.0 && rd.y > 0.0) {
      vec2 cell = floor(rd.xz / (rd.y + 0.25) * 260.0);
      bg += uStars * smoothstep(0.9982, 1.0, hash(cell)) * smoothstep(0.03, 0.3, rd.y);
    }

    // The ground, seen from under the cloud or through a gap in it.
    if (rd.y < -0.0005) {
      float tg = (GROUND - ro.y) / rd.y;
      vec3 gp = ro + rd * tg;
      vec3 ground = uGround * (0.86 + 0.28 * noise(vec3(gp.x * 0.9, (gp.z + uThreshold) * 0.9, 0.0)));

      // The runway runs away from its threshold, which is uThreshold kilometres ahead.
      float along = -(gp.z + uThreshold);
      float across = abs(gp.x);
      float strip = uAirport * step(across, 0.05) * step(0.0, along) * step(along, 3.0);
      vec3 asphalt = uGround * 1.5 + 0.012;
      float dashes = step(across, 0.0011) * step(0.5, fract(along * 16.0));
      float keys = step(along, 0.05) * step(0.008, across) * step(across, 0.044) * step(0.5, fract(across * 130.0));
      float zone = step(0.15, along) * step(along, 0.9) * step(fract(along * 6.6), 0.2)
                 * step(0.012, across) * step(across, 0.03);
      float paint = clamp(dashes + keys + zone, 0.0, 1.0);

      // What the landing lights reach: a pool a little ahead of the aircraft.
      vec2 from = (gp.xz - uPool) / vec2(0.07, 0.16);
      float pool = uLanding * exp(-dot(from, from)) * smoothstep(0.7, 0.0, ro.y - GROUND);

      ground = mix(ground, asphalt + paint * (0.08 + 0.9 * pool), strip);
      ground += vec3(1.0, 0.96, 0.86) * pool * mix(0.05, 0.3, strip);
      float far = 1.0 - exp(-tg * 0.045);
      bg = mix(ground, mix(uMid * 0.5, haze, far * far), far);
    }

    // March the slab of air the cloud can occupy.
    float t0 = 0.0;
    float t1 = FAR;
    if (abs(rd.y) > 0.0001) {
      float a = (BASE - ro.y) / rd.y;
      float b = (TOP - ro.y) / rd.y;
      t0 = max(min(a, b), 0.0);
      t1 = min(max(a, b), FAR);
    } else if (ro.y < BASE || ro.y > TOP) {
      t1 = -1.0;
    }

    vec4 sum = vec4(0.0);
    if (t1 > t0) {
      // The same offset every frame, spread so that the blur in the next pass evens it out.
      float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
      float t = t0 + 0.7 * jitter * max(0.06, 0.045 * t0);
      for (int i = 0; i < 72; i++) {
        if (float(i) >= uSteps || t > t1 || sum.a > 0.985) break;
        vec3 pos = ro + rd * t;
        int octaves = t < 3.0 ? 5 : (t < 8.0 ? 4 : (t < 20.0 ? 3 : 2));
        float den = density(pos, octaves);
        float dt = max(0.06, 0.048 * t);
        if (den > 0.01) {
          // Brighter where the cloud thins toward the sun.
          float lit = clamp((den - density(pos + 0.3 * uSunDir, octaves)) / 0.3, 0.0, 1.0);
          vec3 col = mix(uLit, uShade, den) * (uAmbient + uSun * lit * 0.95);
          col += uSun * uRim * pow(max(dot(rd, uSunDir), 0.0), 4.0) * (1.0 - den);
          col = mix(col, haze, 1.0 - exp(-0.0011 * t * t));
          float alpha = (1.0 - exp(-den * dt * 9.0)) * (1.0 - sum.a);
          sum += vec4(col * alpha, alpha);
        }
        t += dt;
      }
    }

    vec3 col = bg * (1.0 - sum.a) + sum.rgb;
    col += (hash(gl_FragCoord.xy * 1.7 + 3.1) - 0.5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }
`;

const BLIT_FRAGMENT = /* glsl */ `
  uniform sampler2D uFrame;
  uniform vec2 uTexel;
  varying vec2 vUv;
  void main() {
    // Five taps take the grain out of the marched cloud; nothing in this frame has a hard edge to lose.
    vec3 col = texture2D(uFrame, vUv).rgb * 0.4
      + texture2D(uFrame, vUv + uTexel * vec2(0.6, 0.25)).rgb * 0.15
      + texture2D(uFrame, vUv + uTexel * vec2(-0.25, 0.6)).rgb * 0.15
      + texture2D(uFrame, vUv + uTexel * vec2(-0.6, -0.25)).rgb * 0.15
      + texture2D(uFrame, vUv + uTexel * vec2(0.25, -0.6)).rgb * 0.15;
    vec2 q = vUv - 0.5;
    col *= 1.0 - 0.22 * dot(q, q);
    gl_FragColor = vec4(col, 1.0);
  }
`;

const VEIL_FRAGMENT = /* glsl */ `
  uniform sampler2D uNoise;
  uniform float uVeil;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;

  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    vec2 uv = (p.xy + vec2(37.0, 17.0) * p.z) + f.xy;
    vec2 rg = textureLod(uNoise, (uv + 0.5) / 256.0, 0.0).yx;
    return mix(rg.x, rg.y, f.z);
  }

  void main() {
    // Shreds of cloud rushing at the lens.
    vec3 p = vec3(vUv * vec2(2.6, 1.6), uTime * 0.7);
    float wisps = 0.6 * noise(p + vec3(0.0, uTime * 0.9, 0.0)) + 0.4 * noise(p * 2.3 + vec3(uTime * 0.3, uTime * 1.7, 0.0));
    float alpha = clamp(uVeil * (0.55 + 0.9 * wisps), 0.0, 1.0);
    gl_FragColor = vec4(uColor * (0.94 + 0.1 * wisps), alpha);
  }
`;

const LIGHTS_VERTEX = /* glsl */ `
  attribute vec3 tint;
  attribute vec2 kind;
  uniform float uPixels;
  uniform float uTime;
  uniform float uOn;
  varying vec3 vTint;
  varying float vGlow;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = -mv.z;
    // kind.x is the lamp's size; kind.y above zero makes it one of the approach strobes,
    // which fire in turn toward the threshold, twice a second.
    float strobe = kind.y > 0.0 ? step(0.86, fract(uTime * 2.0 - kind.y)) * 3.0 : 1.0;
    float twinkle = 0.86 + 0.14 * sin(uTime * 3.0 + position.x * 91.0 + position.z * 57.0);
    float size = kind.x * uPixels / max(dist, 0.02);
    gl_PointSize = clamp(size, 1.6, 30.0);
    // A lamp smaller than its minimum sprite gets dimmer rather than staying as bright.
    vGlow = uOn * strobe * twinkle * clamp(size / 1.6, 0.4, 1.0) * exp(-dist * 0.05);
    vTint = tint;
  }
`;

const LIGHTS_FRAGMENT = /* glsl */ `
  varying vec3 vTint;
  varying float vGlow;
  void main() {
    vec2 q = gl_PointCoord * 2.0 - 1.0;
    float r2 = dot(q, q);
    float core = exp(-r2 * 7.0);
    float halo = exp(-r2 * 2.2) * 0.35;
    gl_FragColor = vec4(vTint * (core + halo) * vGlow, 1.0);
  }
`;

/* ───────────────────────── things in the scene ───────────────────────── */

const fullscreenTriangle = () => {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
  return geometry;
};

/** A small repeatable generator, so the cloud and the city are the same on every visit. */
const seeded = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const noiseTexture = () => {
  const size = 256;
  const random = seeded(7);
  const red = new Uint8Array(size * size);
  for (let i = 0; i < red.length; i++) red[i] = Math.floor(random() * 256);
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = y * size + x;
      data[i * 4] = red[i];
      data[i * 4 + 1] = red[((y - 17 + size) % size) * size + ((x - 37 + size) % size)];
      data[i * 4 + 3] = 255;
    }
  }
  const map = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.minFilter = map.magFilter = THREE.LinearFilter;
  map.colorSpace = THREE.NoColorSpace;
  map.needsUpdate = true;
  return map;
};

/** A folded dart: two wings, and the keel under them that you hold it by. */
const paperPlane = () => {
  const nose = [0, 0.02, -1.55];
  const leftTip = [-1.0, 0.2, 1.0];
  const rightTip = [1.0, 0.2, 1.0];
  const leftFold = [-0.1, 0.0, 1.0];
  const rightFold = [0.1, 0.0, 1.0];
  const keel = [0, -0.5, 1.0];
  const faces = [
    [nose, leftTip, leftFold],
    [nose, rightFold, rightTip],
    [nose, leftFold, keel],
    [nose, keel, rightFold],
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(faces.flat(2)), 3));
  geometry.computeVertexNormals();
  const paper = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.95,
    metalness: 0,
    side: THREE.DoubleSide,
    flatShading: true,
    transparent: true,
    // Paper lets light through, so a wing turned away from the sun still glows a little.
    emissive: 0xfff1dc,
    emissiveIntensity: 0.5,
  });
  const group = new THREE.Group();
  group.add(new THREE.Mesh(geometry, paper));
  group.scale.setScalar(PAPER_SCALE);
  return { group, materials: [paper] };
};

/** A flat swept panel (a wing, a tailplane) from its outline, lying in the XZ plane. */
const panel = (outline: [number, number][], thickness: number) => {
  const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, z)));
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  // The outline was drawn as (x, z); lay it flat with its thickness going down.
  geometry.rotateX(Math.PI / 2);
  return geometry;
};

/** An airliner out of a turned profile and a handful of panels, in the page's own livery. */
const airliner = () => {
  const paint = (color: number, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
    new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.1, transparent: true, ...extra });
  const white = paint(0xf6f8fc);
  const cobalt = paint(0x1838dc);
  // The yellow carries a little light of its own, or it goes olive in shade.
  const sun = paint(0xffce1f, { emissive: 0xffce1f, emissiveIntensity: 0.3 });
  const dark = paint(0x0a1230, { roughness: 0.7 });
  const materials = [white, cobalt, sun, dark];
  const group = new THREE.Group();

  // Fuselage: radius against length, turned about the long axis.
  const profile: [number, number][] = [
    [0, -3.0],
    [0.1, -2.94],
    [0.2, -2.8],
    [0.28, -2.58],
    [0.335, -2.26],
    [0.365, -1.8],
    [0.375, -1.0],
    [0.375, 1.0],
    [0.345, 1.7],
    [0.27, 2.3],
    [0.17, 2.75],
    [0.08, 3.0],
    [0, 3.02],
  ];
  const fuselage = new THREE.LatheGeometry(
    profile.map(([r, y]) => new THREE.Vector2(r, y)),
    32
  );
  fuselage.rotateX(Math.PI / 2);
  // The tail sweeps up so it clears the runway when the nose lifts.
  const body = fuselage.attributes.position;
  for (let i = 0; i < body.count; i++) {
    const z = body.getZ(i);
    if (z > 1) body.setY(i, body.getY(i) + ((z - 1) / 2) ** 2 * 0.2);
  }
  fuselage.computeVertexNormals();
  group.add(new THREE.Mesh(fuselage, white));

  // A cobalt line along the windows, as a band a hair outside the skin on each side.
  for (const side of [1, -1]) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 3.9), cobalt);
    line.position.set(side * 0.374, 0.05, -0.3);
    group.add(line);
  }

  const wing: [number, number][] = [
    [0.22, -0.6],
    [3.25, 1.02],
    [3.25, 1.38],
    [0.22, 0.78],
  ];
  const tailplane: [number, number][] = [
    [0.08, 2.2],
    [1.3, 2.82],
    [1.3, 3.04],
    [0.08, 2.86],
  ];
  const gear: THREE.Object3D[] = [];
  for (const side of [1, -1]) {
    const mirrored = (outline: [number, number][]) => outline.map(([x, z]) => [x * side, z] as [number, number]);
    const wingMesh = new THREE.Mesh(panel(mirrored(wing), 0.07), white);
    wingMesh.position.y = -0.1;
    wingMesh.rotation.z = side * 0.09;
    group.add(wingMesh);

    const tail = new THREE.Mesh(panel(mirrored(tailplane), 0.045), white);
    tail.position.y = 0.32;
    tail.rotation.z = side * 0.05;
    group.add(tail);

    // The wingtip turns up into a small swept fin.
    const tip = new THREE.Shape([
      new THREE.Vector2(1.02, 0),
      new THREE.Vector2(1.38, 0),
      new THREE.Vector2(1.56, 0.34),
      new THREE.Vector2(1.42, 0.34),
    ]);
    const winglet = new THREE.ExtrudeGeometry(tip, { depth: 0.03, bevelEnabled: false });
    winglet.translate(0, 0, -0.015);
    winglet.rotateY(-Math.PI / 2);
    const wingletMesh = new THREE.Mesh(winglet, sun);
    wingletMesh.position.set(side * 3.24, 0.17, 0);
    wingletMesh.rotation.z = side * -0.3;
    group.add(wingletMesh);

    const engine = new THREE.CylinderGeometry(0.2, 0.165, 0.86, 24);
    engine.rotateX(Math.PI / 2);
    const nacelle = new THREE.Mesh(engine, cobalt);
    nacelle.position.set(side * 1.18, -0.42, -0.08);
    group.add(nacelle);
    const intake = new THREE.Mesh(new THREE.CircleGeometry(0.168, 24), dark);
    intake.position.set(side * 1.18, -0.42, -0.512);
    intake.rotation.y = Math.PI;
    group.add(intake);
    const exhaust = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), dark);
    exhaust.position.set(side * 1.18, -0.42, 0.352);
    group.add(exhaust);

    // Main gear: a leg under each wing root, with a pair of wheels.
    const leg = new THREE.Group();
    const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.5, 0.05), dark);
    strut.position.y = -0.25;
    const wheels = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.2, 14), dark);
    wheels.rotation.z = Math.PI / 2;
    wheels.position.y = -0.56;
    leg.add(strut, wheels);
    leg.position.set(side * 0.52, -0.13, 0.25);
    group.add(leg);
    gear.push(leg);
  }
  const noseLeg = new THREE.Group();
  const noseStrut = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), dark);
  noseStrut.position.y = -0.21;
  const noseWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 12), dark);
  noseWheel.rotation.z = Math.PI / 2;
  noseWheel.position.y = -0.44;
  noseLeg.add(noseStrut, noseWheel);
  noseLeg.position.set(0, -0.28, -2.2);
  group.add(noseLeg);
  gear.push(noseLeg);

  // The fin, drawn as (z, y) and stood up along the centre line.
  const finShape = new THREE.Shape(
    (
      [
        [1.75, 0.28],
        [2.7, 1.55],
        [3.02, 1.55],
        [2.92, 0.3],
      ] as [number, number][]
    ).map(([z, y]) => new THREE.Vector2(z, y))
  );
  const fin = new THREE.ExtrudeGeometry(finShape, { depth: 0.07, bevelEnabled: false });
  fin.translate(0, 0, -0.035);
  fin.rotateY(-Math.PI / 2);
  const finMesh = new THREE.Mesh(fin, cobalt);
  finMesh.position.y = 0.14;
  group.add(finMesh);
  for (const side of [1, -1]) {
    const roundel = new THREE.Mesh(new THREE.CircleGeometry(0.2, 28), sun);
    roundel.position.set(side * 0.04, 1.12, 2.62);
    roundel.rotation.y = (side * Math.PI) / 2;
    group.add(roundel);
  }

  group.scale.setScalar(AIRLINER_SCALE);
  return { group, materials, gear };
};

const glowTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.18, "rgba(255,255,255,0.75)");
  gradient.addColorStop(0.45, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
};

interface Lamp {
  sprite: THREE.Sprite;
  /** How the lamp behaves: steady, a double flash, a slow beacon, or the landing lights. */
  mode: "steady" | "strobe" | "beacon" | "landing";
  size: number;
}

/** Navigation lights, as they are on a real aircraft: red to port, green to starboard, white aft. */
const navigationLights = (aircraft: THREE.Group, map: THREE.Texture) => {
  const lamps: Lamp[] = [];
  const add = (color: number, position: [number, number, number], mode: Lamp["mode"], size: number) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({ map, color, blending: THREE.AdditiveBlending, depthTest: false, transparent: true })
    );
    sprite.position.set(...position);
    aircraft.add(sprite);
    lamps.push({ sprite, mode, size });
  };
  add(0xff2a1f, [-3.3, 0.2, 1.25], "steady", 0.6);
  add(0x2bff6a, [3.3, 0.2, 1.25], "steady", 0.6);
  add(0xffffff, [0, 0.5, 3.05], "steady", 0.45);
  add(0xffffff, [-3.34, 0.24, 1.3], "strobe", 1.6);
  add(0xffffff, [3.34, 0.24, 1.3], "strobe", 1.6);
  add(0xff3324, [0, 0.52, -0.2], "beacon", 1.0);
  add(0xfff3d6, [-0.55, -0.22, -0.7], "landing", 2.4);
  add(0xfff3d6, [0.55, -0.22, -0.7], "landing", 2.4);
  return lamps;
};

/** Every lamp on and around the airport, and the town beyond it, as one cloud of points. */
const airportLights = () => {
  const positions: number[] = [];
  const tints: number[] = [];
  const kinds: number[] = [];
  const y = GROUND + 0.002;
  const lamp = (x: number, z: number, tint: Rgb, size = 1, strobe = 0) => {
    positions.push(x, y, z);
    tints.push(...tint);
    kinds.push(size, strobe);
  };
  const WHITE: Rgb = [1, 0.97, 0.88];
  const AMBER: Rgb = [1, 0.74, 0.22];
  const RED: Rgb = [1, 0.14, 0.08];
  const GREEN: Rgb = [0.2, 1, 0.42];
  const BLUE: Rgb = [0.25, 0.42, 1];
  const SODIUM: Rgb = [1, 0.62, 0.3];
  const LENGTH = 3;
  const HALF = 0.05;

  // Positions are measured from the threshold: the runway runs toward -z, the approach comes from +z.
  for (let d = 0; d <= LENGTH + 1e-6; d += 0.06) {
    const tint = d > LENGTH - 0.6 ? AMBER : WHITE;
    lamp(-HALF, -d, tint, 1.1);
    lamp(HALF, -d, tint, 1.1);
  }
  for (let d = 0.03; d < LENGTH; d += 0.03) lamp(0, -d, d > LENGTH - 0.3 ? RED : WHITE, 0.7);
  for (let x = -HALF; x <= HALF + 1e-6; x += 0.0083) {
    lamp(x, 0.006, GREEN, 1.15);
    lamp(x, -LENGTH - 0.006, RED, 1.15);
  }
  for (let d = 0.03; d <= 0.9; d += 0.03) {
    for (const x of [0.012, 0.018, 0.024]) {
      lamp(x, -d, WHITE, 0.6);
      lamp(-x, -d, WHITE, 0.6);
    }
  }
  // The approach lights: bars across the centre line, a wide bar at 300 m, and the strobes running in.
  for (let d = 0.03; d <= 0.9; d += 0.03) {
    for (let x = -0.008; x <= 0.008 + 1e-6; x += 0.004) lamp(x, d, WHITE, 0.95);
    if (d > 0.3) lamp(0, d, WHITE, 2.4, 1 - (d - 0.3) / 0.6 + 0.001);
    if (d < 0.28) {
      for (const x of [0.02, 0.024, 0.028]) {
        lamp(x, d, RED, 0.8);
        lamp(-x, d, RED, 0.8);
      }
    }
  }
  for (let x = -0.045; x <= 0.045 + 1e-6; x += 0.0045) lamp(x, 0.3, WHITE, 1.0);
  for (let x = -0.026; x <= 0.026 + 1e-6; x += 0.0045) lamp(x, 0.15, WHITE, 1.0);
  // Four lamps beside the touchdown point: two red and two white means the glide path is right.
  [RED, RED, WHITE, WHITE].forEach((tint, i) => lamp(-0.075 - i * 0.009, -0.3, tint, 1.5));
  // Taxiways peel off to the terminal on the right.
  for (const exit of [0.9, 1.7, 2.6]) {
    for (let s = 0; s <= 1; s += 0.04) {
      lamp(HALF + s * 0.34, -exit - s * 0.16, BLUE, 0.7);
      lamp(HALF + s * 0.34, -exit - s * 0.16 - 0.03, BLUE, 0.7);
    }
  }
  for (let d = 0.6; d <= 3.1; d += 0.035) {
    lamp(0.41, -d, BLUE, 0.7);
    lamp(0.44, -d, BLUE, 0.7);
  }

  const random = seeded(11);
  // The terminal and its apron.
  for (let i = 0; i < 260; i++) {
    lamp(0.5 + random() * 0.5, -1.0 - random() * 1.3, random() < 0.7 ? SODIUM : WHITE, 0.8 + random() * 0.7);
  }
  // The town: lit streets on a loose grid, thinning with distance from a few centres.
  const centres = Array.from({ length: 7 }, () => [(random() - 0.5) * 22, -3 - random() * 24, 1.5 + random() * 3.5]);
  let placed = 0;
  while (placed < 3200) {
    const x = (random() - 0.5) * 34;
    const z = 8 - random() * 40;
    if (Math.abs(x) < 0.75 && z < 1.6 && z > -4.2) continue;
    let weight = 0.06;
    for (const [cx, cz, radius] of centres) weight += Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (radius * radius));
    if (random() > weight) continue;
    // Most lamps stand along a street.
    const street = random() < 0.75;
    const northSouth = random() < 0.5;
    const sx = street && northSouth ? Math.round(x / 0.22) * 0.22 : x;
    const sz = street && !northSouth ? Math.round(z / 0.22) * 0.22 : z;
    const pick = random();
    lamp(sx, sz, pick < 0.62 ? SODIUM : pick < 0.9 ? WHITE : pick < 0.95 ? RED : BLUE, 1.1 + random() * 1.3);
    placed++;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("tint", new THREE.Float32BufferAttribute(tints, 3));
  geometry.setAttribute("kind", new THREE.Float32BufferAttribute(kinds, 2));
  return geometry;
};

/* ───────────────────────── the flight ───────────────────────── */

export function createFlight(canvas: HTMLCanvasElement, options: FlightOptions): FlightHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.autoClear = false;
  renderer.setClearColor(0x0a1a78, 1);

  const noise = noiseTexture();
  const triangle = fullscreenTriangle();
  const flat = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const pass = (material: THREE.ShaderMaterial) => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(triangle, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    return scene;
  };
  const vec3 = () => ({ value: new THREE.Vector3() });

  /* The air. */
  const sky = new THREE.ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: SKY_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uNoise: { value: noise },
      uCamera: { value: new THREE.Matrix3() },
      uAltitude: { value: 1.2 },
      uTanHalf: { value: 0.5 },
      uAspect: { value: 1.6 },
      uTime: { value: 0 },
      uTravel: { value: new THREE.Vector2() },
      uSteps: { value: options.compact ? 44 : 64 },
      uSunDir: vec3(),
      uSun: vec3(),
      uZenith: vec3(),
      uMid: vec3(),
      uHorizon: vec3(),
      uAmbient: vec3(),
      uLit: vec3(),
      uShade: vec3(),
      uGround: vec3(),
      uRim: { value: 0.2 },
      uStars: { value: 0 },
      uThreshold: { value: 20 },
      uAirport: { value: 0 },
      uLanding: { value: 0 },
      uPool: { value: new THREE.Vector2() },
    },
  });
  const skyScene = pass(sky);

  const frame = new THREE.WebGLRenderTarget(2, 2, {
    depthBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });
  const blit = new THREE.ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: BLIT_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    uniforms: { uFrame: { value: frame.texture }, uTexel: { value: new THREE.Vector2() } },
  });
  const blitScene = pass(blit);

  const veil = new THREE.ShaderMaterial({
    vertexShader: FULLSCREEN_VERTEX,
    fragmentShader: VEIL_FRAGMENT,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    uniforms: { uNoise: { value: noise }, uVeil: { value: 0 }, uTime: { value: 0 }, uColor: vec3() },
  });
  const veilScene = pass(veil);

  /* The solid things: the airport's lamps on the ground, and the aircraft just ahead of the camera. */
  const eye = new THREE.PerspectiveCamera(50, 1.6, 0.004, 90);
  eye.rotation.order = "YXZ";
  const world = new THREE.Scene();
  world.add(eye);
  const lamps = new THREE.ShaderMaterial({
    vertexShader: LIGHTS_VERTEX,
    fragmentShader: LIGHTS_FRAGMENT,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    uniforms: { uPixels: { value: 1 }, uTime: { value: 0 }, uOn: { value: 0 } },
  });
  const airport = new THREE.Points(airportLights(), lamps);
  airport.frustumCulled = false;
  airport.renderOrder = -1;
  world.add(airport);

  const sunLamp = new THREE.DirectionalLight(0xffffff, 2);
  const skyLamp = new THREE.HemisphereLight(0xffffff, 0x4052c6, 1);
  // A soft light from over the camera's shoulder, so the side we look at is never only in shade.
  const fillLamp = new THREE.DirectionalLight(0xffffff, 0.8);
  fillLamp.position.set(-0.4, 1, 0.9);
  world.add(sunLamp, skyLamp, fillLamp);

  // The aircraft rides with the camera, so its place in the frame is ours to compose.
  const mount = new THREE.Group();
  eye.add(mount);
  const paper = paperPlane();
  const jet = airliner();
  mount.add(paper.group, jet.group);
  const navLights = navigationLights(jet.group, glowTexture());

  /* State. */
  const pointer = { x: 0, y: 0 };
  const seat = { x: 0, y: 0, set: false };
  const lean = { roll: 0, pitch: 0 };
  const travel = new THREE.Vector2();
  let progress = 0;
  let shown = 0;
  let active = true;
  let disposed = false;
  let raf = 0;
  let last = 0;
  let clock = 0;
  let width = 1;
  let height = 1;
  let scale = options.compact ? 0.42 : 0.58;
  let first = true;
  /** The jolt as the wheels meet the runway, fading from 1. */
  let thump = 0;
  let wasDown = true;
  /** Frame times while settling in, to step the cloud down on a machine that struggles. */
  const samples: number[] = [];
  let tuned = false;

  const tmp = new THREE.Vector3();
  const tmp2 = new THREE.Vector3();
  const sunDir = new THREE.Vector3();
  const attitude = new THREE.Euler(0, 0, 0, "YXZ");
  const inWorld = new THREE.Quaternion();
  const pool = new THREE.Vector3();

  const sizeFrame = () => {
    const w = Math.max(2, Math.round(Math.min(width * scale, 960)));
    const h = Math.max(2, Math.round((w * height) / width));
    frame.setSize(w, h);
    blit.uniforms.uTexel.value.set(1 / w, 1 / h);
  };

  const resize = () => {
    width = Math.max(1, canvas.clientWidth);
    height = Math.max(1, canvas.clientHeight);
    // Sharp enough for the aircraft's edges, without filling more pixels than a laptop's GPU has time for.
    const budget = Math.sqrt((options.compact ? 2.4e6 : 3.4e6) / (width * height));
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2, Math.max(1, budget)));
    renderer.setSize(width, height, false);
    const aspect = width / height;
    // A tall screen needs a wider lens to keep the horizon and the aircraft both in frame.
    eye.fov = aspect < 0.8 ? 68 : aspect < 1.2 ? 58 : 50;
    eye.aspect = aspect;
    eye.updateProjectionMatrix();
    const tanHalf = Math.tan((eye.fov * Math.PI) / 360);
    sky.uniforms.uAspect.value = aspect;
    sky.uniforms.uTanHalf.value = tanHalf;
    lamps.uniforms.uPixels.value = ((height * renderer.getPixelRatio()) / (2 * tanHalf)) * 0.0036;
    sizeFrame();
    if (options.still) draw(0);
  };

  const draw = (dt: number) => {
    clock += dt;
    // Scroll is already smoothed by the page; this takes the last steps out of a wheel.
    shown = options.still ? progress : shown + (progress - shown) * (1 - Math.exp(-dt * 9));
    const p = clamp(shown);
    const narrow = width / height < 0.8;
    const follow = (rate: number) => (options.still ? 1 : 1 - Math.exp(-dt * rate));

    const time = along(TIME_OF_DAY, p);
    const night = clamp(time - 1);
    const elevation = (along(SUN_ELEVATION, p) * Math.PI) / 180;
    sunDir.set(Math.sin(SUN_AZIMUTH) * Math.cos(elevation), Math.sin(elevation), -Math.cos(SUN_AZIMUTH) * Math.cos(elevation));
    const heading = along(HEADING, p);
    const speed = along(AIRSPEED, p) * dt;
    // The air goes by along the aircraft's heading, which early on is to the left of where we look.
    travel.x -= Math.sin(heading) * speed;
    travel.y -= Math.cos(heading) * speed;
    const threshold = along(TO_THRESHOLD, p);
    const isPaper = p < SWAP_AT;
    // On final approach the aircraft comes to the middle of the frame, over the centre line.
    const lineUp = smooth(clamp((p - 0.74) / 0.1));

    /* Where the aircraft sits in the frame, and how it leans into where the pointer is. */
    // On a wide screen the camera looks a little left of the runway on the way in, which puts
    // the aircraft and the runway under it right of centre, clear of the words on the left.
    const glance = narrow ? 0 : APPROACH_GLANCE * lineUp;
    const baseX = narrow ? 0 : lerp(0.027, AHEAD * Math.sin(APPROACH_GLANCE), lineUp);
    const baseY = narrow ? lerp(-0.027, -0.022, lineUp) + (options.lift ?? 0) : lerp(-0.004, -0.017, lineUp);
    const reach = lerp(1, 0.12, lineUp);
    const targetX = baseX + pointer.x * (narrow ? 0.008 : 0.017) * reach;
    const targetY = baseY - pointer.y * 0.007 * reach;
    if (!seat.set) {
      seat.x = targetX;
      seat.y = targetY;
      seat.set = true;
    }
    const dx = targetX - seat.x;
    const dy = targetY - seat.y;
    seat.x += dx * follow(3.2);
    seat.y += dy * follow(3.2);

    const camPitch = (along(PITCH, p) * Math.PI) / 180;
    // Where the camera would be on its curve, and the lowest it can go with the wheels on the runway.
    const lowest = GROUND + GEAR - (seat.y * Math.cos(camPitch) + AHEAD * Math.sin(camPitch));
    const altitude = Math.max(along(ALTITUDE, p), lowest);
    const down = altitude === lowest;
    const rock = options.still || down ? 0 : 1;

    lean.roll += (-dx * 55 - pointer.x * 0.2 * reach - lean.roll) * follow(4);
    lean.pitch += (along(ATTITUDE, p) + dy * 26 - lean.pitch) * follow(4);
    const flutter = isPaper
      ? rock * (Math.sin(clock * 1.7) * 0.08 + Math.sin(clock * 2.9) * 0.04)
      : rock * Math.sin(clock * 0.8) * 0.02;
    const bob = rock * Math.sin(clock * 1.3) * (isPaper ? 0.0011 : 0.0004);

    if (down && !wasDown && !options.still) thump = 1;
    wasDown = down;
    thump *= Math.exp(-dt * 5);
    eye.position.set(0, altitude + thump * 0.0008 * Math.sin(clock * 62), 0);
    eye.rotation.set(camPitch, glance - pointer.x * 0.03 * reach, lean.roll * 0.28 * (down ? 0 : 1));
    mount.position.set(seat.x, seat.y + bob, -AHEAD);
    // The aircraft's attitude is set against the world, not against the camera carrying it.
    attitude.set(lean.pitch, heading - lean.roll * 0.3, lean.roll + flutter);
    mount.quaternion.copy(eye.quaternion).invert().multiply(inWorld.setFromEuler(attitude));
    eye.updateMatrixWorld(true);

    /* Light for this moment of the day. */
    const u = sky.uniforms;
    u.uCamera.value.setFromMatrix4(eye.matrixWorld);
    u.uAltitude.value = altitude;
    u.uTime.value = clock;
    u.uTravel.value.copy(travel);
    u.uSunDir.value.copy(sunDir);
    mixLight(time, "sun", u.uSun.value);
    mixLight(time, "zenith", u.uZenith.value);
    mixLight(time, "mid", u.uMid.value);
    mixLight(time, "horizon", u.uHorizon.value);
    mixLight(time, "ambient", u.uAmbient.value);
    mixLight(time, "lit", u.uLit.value);
    mixLight(time, "shade", u.uShade.value);
    mixLight(time, "ground", u.uGround.value);
    // Low sun catches the edges of the cloud; high sun does not.
    u.uRim.value = time < 1 ? lerp(0.5, 0.14, time) : lerp(0.14, 0.42, time - 1);
    // Under the overcast there are no stars to see.
    u.uStars.value = altitude > CLOUD_TOP ? night * 0.9 : 0;
    u.uThreshold.value = threshold;
    const airportOn = smooth(clamp((p - 0.74) / 0.05));
    u.uAirport.value = airportOn;
    const landing = smooth(clamp((p - 0.8) / 0.06));
    u.uLanding.value = landing;
    // The landing lights fall on the ground some way ahead of the nose.
    mount.getWorldPosition(pool);
    u.uPool.value.set(pool.x, pool.z - 0.12);

    /* The airport comes up to meet us. */
    airport.position.z = -threshold;
    lamps.uniforms.uTime.value = clock;
    lamps.uniforms.uOn.value = airportOn;

    /* Inside the cloud everything goes white, and that is where one aircraft becomes the other. */
    const whiteout = smooth(1 - clamp(Math.abs(altitude - 0.56) / 0.5));
    veil.uniforms.uVeil.value = whiteout * 0.95;
    veil.uniforms.uTime.value = clock;
    // The fog is the lit cloud with some of its shadow in it, so type over it stays readable.
    mixLight(time, "lit", tmp).multiplyScalar(0.74);
    veil.uniforms.uColor.value.copy(tmp).addScaledVector(mixLight(time, "shade", tmp2), 0.26);

    paper.group.visible = isPaper;
    jet.group.visible = !isPaper;
    const solid = 1 - smooth(clamp((whiteout - 0.3) / 0.5));
    for (const material of paper.materials) material.opacity = solid;
    for (const material of jet.materials) material.opacity = solid;
    // The wheels come down once we are under the cloud.
    const gearDown = smooth(clamp((p - 0.8) / 0.05));
    for (const leg of jet.gear) {
      leg.scale.y = Math.max(gearDown, 0.001);
      leg.visible = gearDown > 0.01;
    }

    sunLamp.position.copy(sunDir).multiplyScalar(10);
    mixLight(time, "sun", tmp);
    sunLamp.color.setRGB(tmp.x, tmp.y, tmp.z, THREE.SRGBColorSpace);
    sunLamp.intensity = lerp(2.4, 1.1, night) * clamp(0.5 + Math.sin(elevation) * 2.5);
    mixLight(time, "ambient", tmp);
    skyLamp.color.setRGB(tmp.x, tmp.y, tmp.z, THREE.SRGBColorSpace);
    mixLight(time, "shade", tmp);
    skyLamp.groundColor.setRGB(tmp.x, tmp.y, tmp.z, THREE.SRGBColorSpace);
    skyLamp.intensity = lerp(2.2, 1.5, night);
    fillLamp.intensity = lerp(0.9, 0.12, night);

    for (const { sprite, mode, size } of navLights) {
      let level = night * solid;
      if (mode === "strobe") {
        const beat = clock % 1.25;
        level *= beat < 0.05 || (beat > 0.14 && beat < 0.19) ? 1 : 0;
      } else if (mode === "beacon") {
        level *= clock % 1.1 < 0.12 ? 1 : 0.08;
      } else if (mode === "landing") {
        level = landing * solid;
      }
      sprite.material.opacity = level;
      sprite.scale.setScalar(size * (0.5 + 0.5 * level));
      sprite.visible = level > 0.01;
    }

    /* Draw. */
    renderer.setRenderTarget(frame);
    renderer.render(skyScene, flat);
    renderer.setRenderTarget(null);
    renderer.clear();
    renderer.render(blitScene, flat);
    airport.visible = airportOn > 0.001;
    renderer.render(world, eye);
    if (veil.uniforms.uVeil.value > 0.004) renderer.render(veilScene, flat);

    if (first) {
      first = false;
      options.onFirstFrame?.();
    }
  };

  const tick = (now: number) => {
    if (disposed) return;
    raf = requestAnimationFrame(tick);
    if (!active) {
      last = 0;
      return;
    }
    const elapsed = last ? now - last : 16;
    last = now;
    draw(Math.min(elapsed, 80) / 1000);

    // After the first moments, look at how long frames are taking and make the cloud cheaper if needed.
    if (!tuned) {
      samples.push(elapsed);
      if (samples.length === 90) {
        const settled = samples.slice(30).sort((a, b) => a - b);
        const median = settled[Math.floor(settled.length / 2)];
        if (median > 21) {
          scale *= median > 34 ? 0.6 : 0.78;
          sky.uniforms.uSteps.value = median > 34 ? 32 : 44;
          sizeFrame();
          samples.length = 0;
          tuned = scale < 0.24;
        } else {
          tuned = true;
        }
      }
    }
  };

  const onLost = (event: Event) => {
    event.preventDefault();
    cancelAnimationFrame(raf);
    options.onLost?.();
  };
  canvas.addEventListener("webglcontextlost", onLost);

  resize();
  // Every shader is compiled before the first frame is shown. Left to itself each one would be
  // compiled the first time it is needed: the airliner as it leaves the cloud, the airport as
  // it comes into view, each with a stutter.
  const begin = () => {
    if (disposed) return;
    if (options.still) draw(0);
    else raf = requestAnimationFrame(tick);
  };
  // The sky is drawn into the half-size frame, and a shader is compiled for where it draws.
  renderer.setRenderTarget(frame);
  const skyReady = renderer.compileAsync(skyScene, flat);
  renderer.setRenderTarget(null);
  Promise.all([
    skyReady,
    renderer.compileAsync(blitScene, flat),
    renderer.compileAsync(veilScene, flat),
    renderer.compileAsync(world, eye),
  ]).then(begin, begin);

  return {
    setProgress(value) {
      progress = clamp(value);
      if (options.still) draw(0);
    },
    setPointer(x, y) {
      pointer.x = clamp(x, -1, 1);
      pointer.y = clamp(y, -1, 1);
    },
    setActive(on) {
      active = on;
    },
    resize,
    dispose() {
      disposed = true;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onLost);
      frame.dispose();
      noise.dispose();
      triangle.dispose();
      for (const scene of [skyScene, blitScene, veilScene, world]) {
        scene.traverse((object) => {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry && mesh.geometry !== triangle) mesh.geometry.dispose();
          const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
          for (const m of Array.isArray(material) ? material : material ? [material] : []) {
            (m as THREE.SpriteMaterial).map?.dispose();
            m.dispose();
          }
        });
      }
      renderer.dispose();
    },
  };
}
