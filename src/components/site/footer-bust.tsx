"use client";

import { hasHardwareWebGL } from "@/lib/gpu";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

// The tallest a point of the relief can stand, as a fraction of the bust's width.
// scripts/build-bust.mjs writes heights as fractions of this (its ROUND + DEPTH).
const HEIGHT = 0.295;
// Cells along one side of the sheet that is raised into the bust.
const GRID = 96;
// How far he turns to follow the pointer, in radians.
const YAW = 0.44;
const PITCH = 0.2;

const VERTEX = `#version 300 es
in vec2 cell;
uniform sampler2D relief;
uniform mat4 view;
out vec2 uv;
void main() {
  uv = cell;
  float height = texture(relief, cell).r * ${HEIGHT};
  gl_Position = view * vec4(cell.x - 0.5, 0.5 - cell.y, height, 1.0);
}`;

const FRAGMENT = `#version 300 es
precision mediump float;
in vec2 uv;
uniform sampler2D colour;
uniform sampler2D relief;
uniform vec3 light;
out vec4 pixel;
void main() {
  vec4 drawn = texture(colour, uv);
  if (drawn.a < 0.02) discard;
  // The slope of the relief gives the surface its direction, sampled wide enough
  // apart that the map's 256 levels do not show as steps in the light.
  float reach = 3.0 / 256.0;
  float dx = texture(relief, uv + vec2(reach, 0.0)).r - texture(relief, uv - vec2(reach, 0.0)).r;
  float dy = texture(relief, uv + vec2(0.0, reach)).r - texture(relief, uv - vec2(0.0, reach)).r;
  vec3 normal = normalize(vec3(-dx, dy, 2.0 * reach / ${HEIGHT}));
  // The drawing carries its own shading, so the light only leans on it.
  float lit = 0.74 + 0.36 * max(dot(normal, light), 0.0);
  float ink = texture(relief, uv).g;
  pixel = vec4(drawn.rgb * lit * ink, 1.0) * drawn.a;
}`;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });

/** Projection, then a turn about a point inside the head, as one column-major matrix. */
const viewMatrix = (yaw: number, pitch: number) => {
  const [cy, sy, cx, sx] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
  // Rotation: pitch about x after yaw about y.
  const r = [cy, sx * sy, -cx * sy, 0, cx, sx, sy, -sx * cy, cx * cy];
  // The pivot sits behind the face, so turning swings the nose and not the shoulders.
  const pivot = [0, 0.06, 0.1];
  // Larger than the frame, so its cut edges stay outside it however far he turns,
  // and lowered, so the hair keeps its headroom now that the face stands nearer.
  const scale = 1.16;
  const drop = 0.07;
  const distance = 2.4;
  const t = [0, 1, 2].map(
    (k) => pivot[k] - (r[k] * pivot[0] + r[3 + k] * pivot[1] + r[6 + k] * pivot[2])
  );
  const f = 1 / Math.tan((26 * Math.PI) / 360);
  const [near, far] = [0.1, 10];
  const model = [
    r[0] * scale, r[1] * scale, r[2] * scale, 0,
    r[3] * scale, r[4] * scale, r[5] * scale, 0,
    r[6] * scale, r[7] * scale, r[8] * scale, 0,
    t[0] * scale, t[1] * scale - drop, t[2] * scale - distance, 1,
  ];
  const out = new Float32Array(16);
  for (let column = 0; column < 4; column++) {
    const [x, y, z, w] = model.slice(column * 4, column * 4 + 4);
    out[column * 4] = f * x;
    out[column * 4 + 1] = f * y;
    out[column * 4 + 2] = ((far + near) / (near - far)) * z + ((2 * far * near) / (near - far)) * w;
    out[column * 4 + 3] = -z;
  }
  // The light stays put in the room; the shader works in the bust's own space.
  const world = [0.45, 0.5, 0.74];
  const light = [0, 1, 2].map((k) => r[k * 3] * world[0] + r[k * 3 + 1] * world[1] + r[k * 3 + 2] * world[2]);
  return { view: out, light };
};

/**
 * The footer's avatar, raised into a relief that turns to follow the pointer.
 * The flat drawing is always there underneath: it is what shows before the
 * footer is reached, without a GPU, and when motion is turned down.
 */
const FooterBust = ({ className }: { className?: string }) => {
  const frame = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = frame.current;
    const surface = canvas.current;
    if (!node || !surface) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let stop = () => {};

    const start = async () => {
      if (!(await hasHardwareWebGL()) || disposed) return;
      const [drawing, heights] = await Promise.all([
        loadImage("/images/avatar.webp"),
        loadImage("/images/avatar-relief.png"),
      ]).catch(() => [null, null]);
      if (!drawing || !heights || disposed) return;

      const gl = surface.getContext("webgl2", { antialias: true, alpha: true, powerPreference: "low-power" });
      if (!gl) return;

      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return shader;
      };
      const program = gl.createProgram()!;
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const cells = new Float32Array((GRID + 1) * (GRID + 1) * 2);
      for (let j = 0; j <= GRID; j++) {
        for (let i = 0; i <= GRID; i++) cells.set([i / GRID, j / GRID], (j * (GRID + 1) + i) * 2);
      }
      const order = new Uint16Array(GRID * GRID * 6);
      for (let j = 0; j < GRID; j++) {
        for (let i = 0; i < GRID; i++) {
          const a = j * (GRID + 1) + i;
          order.set([a, a + GRID + 1, a + 1, a + 1, a + GRID + 1, a + GRID + 2], (j * GRID + i) * 6);
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, cells, gl.STATIC_DRAW);
      const cell = gl.getAttribLocation(program, "cell");
      gl.enableVertexAttribArray(cell);
      gl.vertexAttribPointer(cell, 2, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, order, gl.STATIC_DRAW);

      [drawing, heights].forEach((image, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      });
      gl.uniform1i(gl.getUniformLocation(program, "colour"), 0);
      gl.uniform1i(gl.getUniformLocation(program, "relief"), 1);
      const viewAt = gl.getUniformLocation(program, "view");
      const lightAt = gl.getUniformLocation(program, "light");

      const size = Math.round(node.clientWidth * Math.min(window.devicePixelRatio || 1, 2));
      surface.width = surface.height = size;
      gl.viewport(0, 0, size, size);
      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);

      // He comes in turned away and settles, so the first thing seen is that he is not flat.
      const pose = { yaw: -YAW, pitch: 0 };
      const target = { yaw: 0, pitch: 0 };
      const follows = window.matchMedia("(pointer: fine)").matches;
      let visible = true;
      let shown = false;
      let raf = 0;

      const draw = (time: number) => {
        raf = 0;
        if (!follows) {
          // No pointer to follow on a touch screen, so he looks slowly from side to side.
          target.yaw = Math.sin(time / 1700) * YAW * 0.7;
          target.pitch = Math.sin(time / 2300) * PITCH * 0.4;
        }
        pose.yaw += (target.yaw - pose.yaw) * 0.08;
        pose.pitch += (target.pitch - pose.pitch) * 0.08;
        const { view, light } = viewMatrix(pose.yaw, pose.pitch);
        gl.uniformMatrix4fv(viewAt, false, view);
        gl.uniform3f(lightAt, light[0], light[1], light[2]);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, order.length, gl.UNSIGNED_SHORT, 0);
        if (!shown) setLive((shown = true));
        const settled = Math.abs(target.yaw - pose.yaw) + Math.abs(target.pitch - pose.pitch) < 0.0006;
        // Nothing is drawn once he has caught up with the pointer, or while he is off screen.
        if (visible && (!follows || !settled)) raf = requestAnimationFrame(draw);
      };
      const wake = () => {
        if (visible && !raf) raf = requestAnimationFrame(draw);
      };

      const onPointer = (event: PointerEvent) => {
        const box = node.getBoundingClientRect();
        const reach = Math.max(window.innerWidth, window.innerHeight) * 0.5;
        const clamp = (value: number) => Math.max(-1, Math.min(1, value));
        target.yaw = clamp((event.clientX - (box.left + box.width / 2)) / reach) * YAW;
        target.pitch = clamp((event.clientY - (box.top + box.height / 2)) / reach) * PITCH;
        wake();
      };
      const onLost = (event: Event) => {
        event.preventDefault();
        setLive(false);
        stop();
      };
      const watcher = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        wake();
      });
      watcher.observe(node);
      if (follows) window.addEventListener("pointermove", onPointer, { passive: true });
      surface.addEventListener("webglcontextlost", onLost);

      stop = () => {
        cancelAnimationFrame(raf);
        watcher.disconnect();
        window.removeEventListener("pointermove", onPointer);
        surface.removeEventListener("webglcontextlost", onLost);
      };
      if (disposed) return stop();
      wake();
    };

    // Nothing is fetched or compiled until the footer is nearly on screen.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        start();
      },
      { rootMargin: "300px" }
    );
    near.observe(node);

    return () => {
      disposed = true;
      near.disconnect();
      stop();
    };
  }, []);

  return (
    <div ref={frame} className={cn("relative shrink-0 overflow-hidden bg-ember", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by scripts/build-avatar.mjs */}
      <img
        src="/images/avatar.webp"
        alt=""
        width={352}
        height={352}
        loading="lazy"
        decoding="async"
        className={cn("size-full transition-opacity duration-500", live && "opacity-0")}
      />
      <canvas
        ref={canvas}
        aria-hidden
        className={cn("absolute inset-0 size-full transition-opacity duration-500", live ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
};

export default FooterBust;
