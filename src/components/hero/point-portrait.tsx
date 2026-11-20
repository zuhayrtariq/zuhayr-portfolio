"use client";

import { getVoiceLevel } from "@/lib/voice/player";
import { cn } from "@/lib/utils";
import { useEffect, useRef, type RefObject } from "react";
import { hasHardwareWebGL, SOFTWARE } from "@/lib/gpu";

/** R = brightness, G = depth, B = subject mask. Built by scripts/build-portrait.mjs. */
const TEXTURE = "/images/portrait-cloud.png";
const TEX_ASPECT = 512 / 599;
/** Where the mouth sits in the texture; speech ripples out from here. */
const MOUTH = [0.437, 0.345];
/** Head centre in model space. The cloud turns around it, so the face stays put. */
const PIVOT = [-0.05, 0.2];

const CAM = 3;
/** 1 / tan(fov / 2) for a 30 degree lens. */
const FOCAL = 3.732;

const VERT = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aUv;
layout(location = 1) in vec4 aSeed;

uniform sampler2D uTex;
uniform float uTime;
uniform float uForm;
uniform float uBurst;
uniform float uVoice;
uniform float uAspect;
uniform float uScale;
uniform float uPx;
uniform vec2 uRot;
uniform vec2 uOffset;
uniform vec3 uPointer;

out float vAlpha;
out float vSolid;
out vec3 vColor;

const float CAM = ${CAM.toFixed(1)};
const float FOCAL = ${FOCAL};
const float TEX_ASPECT = ${TEX_ASPECT.toFixed(5)};
const vec2 MOUTH = vec2(${MOUTH[0]}, ${MOUTH[1]});
const vec2 PIVOT = vec2(${PIVOT[0]}, ${PIVOT[1]});

const vec3 UMBER = vec3(0.13, 0.06, 0.035);
const vec3 RUST = vec3(0.72, 0.3, 0.14);
const vec3 EMBER = vec3(1.0, 0.31, 0.12);
const vec3 TUNGSTEN = vec3(0.94, 0.76, 0.54);
const vec3 BONE = vec3(0.96, 0.95, 0.91);

mat2 rot(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}

void cull() {
  gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  gl_PointSize = 0.0;
  vAlpha = 0.0;
  vSolid = 0.0;
  vColor = vec3(0.0);
}

void main() {
  vec3 t = texture(uTex, aUv).rgb;
  float bright = t.r;
  bool mote = t.b < 0.5;
  // Outside the silhouette, a few points stay on as dust in the air around him.
  if (mote && aSeed.w > 0.03) { cull(); return; }

  vec3 rnd = aSeed.xyz * 2.0 - 1.0;
  vec3 p;
  float glow;
  float fade = 1.0;

  if (mote) {
    p = vec3(rnd.x * 1.5, rnd.y * 0.75, rnd.z * 0.8 - 0.1);
    p.x += cos(uTime * 0.11 + aSeed.y * 40.0) * 0.05;
    p.y += sin(uTime * 0.13 + aSeed.x * 40.0) * 0.05;
    glow = 0.25 + 0.4 * aSeed.z;
  } else {
    p = vec3((aUv.x - 0.5) * TEX_ASPECT, 0.5 - aUv.y, 0.0);
    // The photo leans toward the camera at the waist; take that slope out so the face leads.
    p.z = (t.g - 0.42 - (aUv.y - 0.3) * 0.62) * 0.55 + (bright - 0.5) * 0.02;
    // Spend the tonal range on skin and cloth; the photo's blacks stay black.
    glow = pow(smoothstep(0.2, 1.0, bright), 1.7);
    fade = 1.0 - smoothstep(0.7, 0.99, aUv.y + rnd.x * 0.05);

    // Speech: a ring travelling out from the mouth.
    float md = distance(aUv, MOUTH);
    float ring = sin(md * 46.0 - uTime * 11.0) * exp(-md * 5.5);
    p.z += ring * uVoice * 0.035;
    glow += max(ring, 0.0) * uVoice * 0.5;

    // The cursor lifts a soft swell out of the surface and warms it.
    vec2 d = p.xy - uPointer.xy;
    float press = exp(-dot(d, d) / 0.01) * uPointer.z;
    p.z += press * 0.045;
    glow += press * 0.12;

    p += rnd * 0.0016 * sin(uTime * 1.7 + aSeed.w * 80.0);
  }

  // Arrival: every point flies in from a wide swirl, the face first.
  float st = 0.6;
  float tf = clamp(uForm * (1.0 + st) - aSeed.w * st * (mote ? 30.0 : 1.0), 0.0, 1.0);
  tf = 1.0 - pow(1.0 - tf, 4.0);
  vec3 from = normalize(rnd + 1e-3) * (1.0 + aSeed.x * 2.4);
  from.z = from.z * 0.6 + 1.2;
  vec3 q = mix(from, p, tf);
  q.xz = rot((1.0 - tf) * (1.6 + aSeed.y * 1.6)) * q.xz;

  // Departure: the cloud lets go and streams past the camera.
  float b = clamp(uBurst * 1.35 - aSeed.y * 0.35, 0.0, 1.0);
  b = b * b * (3.0 - 2.0 * b);
  vec2 away = normalize(q.xy - PIVOT + rnd.xy * 0.4);
  q.xy += away * (0.3 + aSeed.z * 2.2) * b;
  q.z += (1.4 + aSeed.x * 3.4) * b * b;
  q.xy = PIVOT + rot(b * rnd.z * 0.9) * (q.xy - PIVOT);

  q.xy -= PIVOT;
  q.xz = rot(uRot.x) * q.xz;
  q.yz = rot(uRot.y) * q.yz;
  q.xy += PIVOT;
  q *= uScale;
  q.xy += uOffset;

  float zc = CAM - q.z;
  if (zc < 0.12) { cull(); return; }

  gl_Position = vec4(q.x * FOCAL / uAspect, q.y * FOCAL, 0.0, zc);
  float spark = mote ? 0.0 : step(0.9965, aSeed.w) * (0.5 + 0.5 * sin(uTime * 1.6 + aSeed.x * 60.0)) * (1.0 - smoothstep(0.12, 0.3, glow));
  gl_PointSize = clamp(uPx * (0.82 + glow * 0.75 + spark * 0.9) * CAM / zc, 1.0, 26.0);

  vec3 color = mix(UMBER, RUST, smoothstep(0.0, 0.16, glow));
  color = mix(color, TUNGSTEN, smoothstep(0.14, 0.52, glow));
  color = mix(color, BONE, smoothstep(0.5, 0.92, glow));
  color = mix(color, EMBER, max(spark, b * 0.7));
  if (mote) color = mix(TUNGSTEN, EMBER, aSeed.y) * glow;

  float near = smoothstep(0.12, 0.9, zc);
  vAlpha = (mote ? glow : 0.92) * fade * near * mix(0.3, 1.0, tf) * (1.0 - smoothstep(0.82, 1.0, uBurst));
  // At rest the points are opaque paint, so the figure hides what is behind it.
  // Sparks, dust and the burst are light, and add up.
  vSolid = mote ? 0.0 : (1.0 - spark) * tf * (1.0 - smoothstep(0.0, 0.25, b));
  vColor = color;
}`;

const FRAG = `#version 300 es
precision mediump float;

in float vAlpha;
in float vSolid;
in vec3 vColor;
out vec4 outColor;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.25, 0.04, dot(c, c)) * vAlpha;
  outColor = vec4(vColor * a, a * vSolid);
}`;

/** Compile errors surface when the program links, so nothing here waits on the driver. */
const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

/** Deterministic, so the cloud is identical on every visit. */
const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface PointPortraitProps {
  /** True while Zuhayr is talking; the cloud moves with his voice. */
  speaking: boolean;
  /** 0 holds the portrait together, 1 has let it go. Read every frame. */
  burst?: RefObject<number>;
  onReady?: () => void;
  /** Called if WebGL2 is unavailable, so the caller can show a still instead. */
  onError?: () => void;
  className?: string;
}

/**
 * Zuhayr's portrait as a cloud of points with real depth, drawn in one WebGL2
 * draw call. It turns toward the cursor, dents under it, and ripples from the
 * mouth when he speaks.
 */
const PointPortrait = ({ speaking, burst, onReady, onError, className }: PointPortraitProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const speakingRef = useRef(speaking);
  speakingRef.current = speaking;
  const callbacks = useRef({ onReady, onError });
  callbacks.current = { onReady, onError };

  useEffect(() => {
    let cancelled = false;
    let dispose: (() => void) | undefined;
    hasHardwareWebGL().then((ok) => {
      if (cancelled) return;
      if (ok) dispose = start();
      else callbacks.current.onError?.();
    });
    return () => {
      cancelled = true;
      dispose?.();
    };

    function start() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const gl = canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true });
      if (!gl) {
        callbacks.current.onError?.();
        return;
      }

      // Where the worker could not ask, check again here.
      const debug = gl.getExtension("WEBGL_debug_renderer_info");
      if (debug && SOFTWARE.test(String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)))) {
        callbacks.current.onError?.();
        return;
      }

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (!vs || !fs || !program) {
        callbacks.current.onError?.();
        return;
      }
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      // Where the driver can compile off the main thread, wait for it instead of blocking.
      const parallel = gl.getExtension("KHR_parallel_shader_compile");
      let linked = !parallel;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compact = window.matchMedia("(width < 48rem)").matches;
      const rows = compact ? 230 : 400;
      const cols = Math.round(rows * TEX_ASPECT);
      const count = rows * cols;
      const data = new Float32Array(count * 6);
      const random = mulberry(7);
      for (let y = 0, i = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++, i += 6) {
          data[i] = (x + random()) / cols;
          data[i + 1] = (y + random()) / rows;
          data[i + 2] = random();
          data[i + 3] = random();
          data[i + 4] = random();
          data[i + 5] = random();
        }
      }
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 24, 0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 24, 8);

      let u: Record<
        "time" | "form" | "burst" | "voice" | "aspect" | "scale" | "px" | "rot" | "offset" | "pointer",
        WebGLUniformLocation | null
      > | null = null;

      gl.disable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      // Layout: how tall the bust stands in the frame, and where its centre sits.
      let aspect = 1;
      let scale = 1;
      let offsetX = 0;
      let offsetY = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, compact ? 1.5 : 2);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        aspect = w / h;
        const style = getComputedStyle(canvas);
        const fill = parseFloat(style.getPropertyValue("--portrait-height")) || 0.84;
        const lift = parseFloat(style.getPropertyValue("--portrait-lift")) || 0;
        const shift = parseFloat(style.getPropertyValue("--portrait-shift")) || 0;
        scale = (2 * fill * CAM) / FOCAL;
        offsetY = ((-1 + fill + lift * 2) * CAM) / FOCAL;
        offsetX = (shift * 2 * aspect * CAM) / FOCAL;
        if (!u) return;
        gl.uniform1f(u.aspect, aspect);
        gl.uniform1f(u.scale, scale);
        gl.uniform2f(u.offset, offsetX, offsetY);
        gl.uniform1f(u.px, ((fill * h) / rows) * dpr * 1.7);
      };

      let pointerX = 0;
      let pointerY = 0;
      let pointerOn = 0;
      const onPointer = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerY = 1 - ((e.clientY - rect.top) / rect.height) * 2;
        pointerOn = e.pointerType === "mouse" ? 1 : 0;
      };

      let frame = 0;
      let visible = true;
      let textured = false;
      let ready = false;
      let formedAt = 0;
      let yaw = 0;
      let pitch = 0;
      let px = 0;
      let py = 0;
      let press = 0;
      let voice = 0;
      let burstNow = 0;

      /** Runs once the program has linked and the texture is in: the first frame can be drawn. */
      const begin = () => {
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program), gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
          callbacks.current.onError?.();
          return;
        }
        gl.useProgram(program);
        const uniform = (name: string) => gl.getUniformLocation(program, name);
        u = {
          time: uniform("uTime"),
          form: uniform("uForm"),
          burst: uniform("uBurst"),
          voice: uniform("uVoice"),
          aspect: uniform("uAspect"),
          scale: uniform("uScale"),
          px: uniform("uPx"),
          rot: uniform("uRot"),
          offset: uniform("uOffset"),
          pointer: uniform("uPointer"),
        };
        resize();
        ready = true;
        formedAt = performance.now();
        callbacks.current.onReady?.();
        kick();
      };

      let waiting = 0;
      const waitForLink = () => {
        waiting = 0;
        linked ||= Boolean(parallel && gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR));
        if (linked && textured) begin();
        else waiting = requestAnimationFrame(waitForLink);
      };

      const draw = (now: number) => {
        frame = 0;
        if (!ready || !u) return;
        const t = now / 1000;
        const form = reduced ? 1 : Math.min(1, (now - formedAt) / 2600);

        const level = speakingRef.current
          ? Math.max(getVoiceLevel(), 0.22 + 0.16 * Math.sin(t * 9) * Math.sin(t * 2.3))
          : 0;
        voice += (level - voice) * 0.18;
        burstNow += ((burst?.current ?? 0) - burstNow) * 0.14;

        const sway = reduced ? 0 : 1;
        yaw += (pointerX * 0.34 * pointerOn + Math.sin(t * 0.45) * 0.1 * sway - yaw) * 0.06;
        pitch += (pointerY * 0.2 * pointerOn + Math.sin(t * 0.33) * 0.03 * sway - pitch) * 0.06;
        // The cursor in model space, on the plane the face sits in.
        const mx = ((pointerX * aspect * CAM) / FOCAL - offsetX) / scale;
        const my = ((pointerY * CAM) / FOCAL - offsetY) / scale;
        px += (mx - px) * 0.2;
        py += (my - py) * 0.2;
        press += (pointerOn - press) * 0.08;

        gl.uniform1f(u.time, reduced ? 0 : t);
        gl.uniform1f(u.form, form);
        gl.uniform1f(u.burst, burstNow);
        gl.uniform1f(u.voice, voice);
        gl.uniform2f(u.rot, yaw, -pitch);
        gl.uniform3f(u.pointer, px, py, press);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, count);

        // Reduced motion draws on demand; otherwise the cloud is always alive while on screen.
        if (visible && !document.hidden && (!reduced || speakingRef.current)) frame = requestAnimationFrame(draw);
      };
      const kick = () => {
        if (!frame) frame = requestAnimationFrame(draw);
      };

      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB8, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        textured = true;
        waitForLink();
      };
      image.onerror = () => callbacks.current.onError?.();
      image.src = TEXTURE;

      const ro = new ResizeObserver(() => {
        resize();
        kick();
      });
      ro.observe(canvas);
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) kick();
      });
      io.observe(canvas);
      const onVisibility = () => !document.hidden && kick();
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pointermove", onPointer, { passive: true });
      const speakingPoll = reduced ? window.setInterval(() => speakingRef.current && kick(), 250) : 0;

      return () => {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(waiting);
        window.clearInterval(speakingPoll);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointer);
        image.onload = null;
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }
  }, [burst]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Zuhayr Tariq, drawn as a cloud of light"
      className={cn("block size-full", className)}
    />
  );
};

export default PointPortrait;
