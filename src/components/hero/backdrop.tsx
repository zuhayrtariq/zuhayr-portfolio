"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// A hand-painted portrait backdrop: domain-warped fbm mottling, brush streaks,
// a tungsten key-light pool that follows the cursor, and a soft vignette.
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uLight;
uniform float uLit;
out vec4 outColor;

const vec3 BACKDROP = vec3(0.114, 0.165, 0.173);
const vec3 UMBRA = vec3(0.067, 0.098, 0.106);
const vec3 TUNGSTEN = vec3(0.941, 0.761, 0.541);

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
  vec2 q = uv * aspect;
  float t = uTime * 0.018;

  vec2 warp = vec2(fbm(q * 1.4 + t), fbm(q * 1.4 - t + 7.3));
  float mottle = fbm(q * 2.0 + warp * 1.5 + t * 0.4);
  float streaks = fbm(q * vec2(7.0, 2.4) + warp * 2.2);

  vec3 col = mix(UMBRA, BACKDROP * 1.38, smoothstep(0.22, 0.86, mottle));
  col *= 0.9 + 0.14 * streaks;

  vec2 L = uLight * aspect;
  float d = distance(q, L);
  float pool = exp(-d * d * 4.5);
  col = mix(col, col + TUNGSTEN * 0.09, pool * uLit);
  col *= mix(0.28, 1.0, uLit);

  vec2 c = uv - 0.5;
  col *= 1.0 - dot(c * vec2(1.05, 1.25), c * vec2(1.05, 1.25)) * 0.85;

  outColor = vec4(col, 1.0);
}`;

const RESOLUTION_SCALE = 0.55;
const LIGHTS_UP_MS = 1400;
const REST_LIGHT: [number, number] = [0.3, 0.68];

const easeOutQuint = (x: number) => 1 - Math.pow(1 - x, 5);

const compile = (gl: WebGL2RenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

interface BackdropProps {
  className?: string;
  /** Start the lights-up fade. Pass false to keep the set dark until ready. */
  lit?: boolean;
}

const Backdrop = ({ className, lit = true }: BackdropProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const litRef = useRef(lit);
  const redrawRef = useRef<() => void>(() => {});
  litRef.current = lit;

  useEffect(() => {
    redrawRef.current();
  }, [lit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vs || !fs || !program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uLight = gl.getUniformLocation(program, "uLight");
    const uLit = gl.getUniformLocation(program, "uLit");

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const light = [...REST_LIGHT];
    const target = [...REST_LIGHT];
    let litStart = -1;
    let visible = true;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr * RESOLUTION_SCALE));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr * RESOLUTION_SCALE));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const draw = (now: number) => {
      resize();
      let litValue = 0;
      if (litRef.current) {
        if (litStart < 0) litStart = now;
        litValue = reduceMotion ? 1 : easeOutQuint(Math.min(1, (now - litStart) / LIGHTS_UP_MS));
      }
      light[0] += (target[0] - light[0]) * 0.04;
      light[1] += (target[1] - light[1]) * 0.04;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, reduceMotion ? 0 : now / 1000);
      gl.uniform2f(uLight, light[0], light[1]);
      gl.uniform1f(uLit, litValue);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      draw(now);
      if (visible && !reduceMotion) frame = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(loop);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      // The light leans toward the cursor but stays a key light, up and to the left.
      target[0] = REST_LIGHT[0] + (x - 0.5) * 0.35;
      target[1] = REST_LIGHT[1] + (y - 0.5) * 0.25;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    if (finePointer && !reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true });

    const ro = new ResizeObserver(() => {
      if (reduceMotion) draw(performance.now());
    });
    ro.observe(canvas);

    // Reduced motion has no render loop, so repaint when `lit` changes.
    redrawRef.current = () => {
      if (reduceMotion) draw(performance.now());
    };

    start();

    return () => {
      cancelAnimationFrame(frame);
      redrawRef.current = () => {};
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        "bg-[radial-gradient(ellipse_at_30%_32%,#2b3b3e_0%,#1d2a2c_45%,#11191b_100%)]",
        className
      )}
    >
      <canvas ref={canvasRef} className="size-full" />
      <div className="grain absolute inset-0" />
    </div>
  );
};

export default Backdrop;
