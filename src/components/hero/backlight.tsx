"use client";

import { hasHardwareWebGL, SOFTWARE } from "@/lib/gpu";
import { cn } from "@/lib/utils";
import { getVoiceLevel } from "@/lib/voice/player";
import { useEffect, useRef, type RefObject } from "react";

/** How far each word of the name travels as the hero lets go, as a fraction of its own width. */
export const NAME_TRAVEL = 0.38;

/** The widest the shadow map is drawn. Shadows are soft, so it never needs the screen's own resolution. */
const MAP_WIDTH = 1024;
/** Steps taken from each pixel back to the lamp. */
const STEPS = 44;

const VERT = `#version 300 es
layout(location = 0) in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

// One lamp in haze, behind the name. Every pixel looks back along a straight line to the
// lamp and counts how much lettering is in the way: that is its shadow. Haze behind the
// letters is lit regardless, so a shadow dims the air without ever going black.
const FRAG = `#version 300 es
precision highp float;

uniform sampler2D uMap;
uniform vec2 uRes;
uniform vec2 uMapSize;
uniform vec2 uLamp;
uniform float uPower;
uniform float uSpread;
uniform float uTime;
uniform float uPart;
uniform vec2 uTravel;

out vec4 outColor;

const vec3 UMBER = vec3(0.16, 0.055, 0.025);
const vec3 RUST = vec3(0.58, 0.17, 0.05);
const vec3 EMBER = vec3(1.0, 0.31, 0.12);
const vec3 TUNGSTEN = vec3(0.94, 0.76, 0.54);
const vec3 BONE = vec3(0.96, 0.95, 0.91);

/** Interleaved gradient noise: even, and free of the clumps a plain hash leaves. */
float ign(vec2 p) {
  return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715))));
}

vec2 hash2(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yzx + 33.33);
  return fract((q.xx + q.yz) * q.zy);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash2(vec2(i, 7.0)).x, hash2(vec2(i + 1.0, 7.0)).x, f);
}

/** How much lettering covers a point. The two words are kept in separate channels so they can part. */
float cover(vec2 p, float lod) {
  if (uPart < 0.001) {
    vec2 m = textureLod(uMap, p, lod).rg;
    return max(m.r, m.g);
  }
  float first = textureLod(uMap, p + vec2(uTravel.x * uPart, 0.0), lod).r;
  float last = textureLod(uMap, p - vec2(uTravel.y * uPart, 0.0), lod).g;
  return max(first, last) * (1.0 - uPart * uPart);
}

/** Dust hanging in the air, which only shows where the light reaches it. */
float dust(vec2 p, float scale, float t) {
  vec2 g = p * scale + vec2(t * 0.011, -t * 0.017) * scale * 0.1;
  vec2 id = floor(g);
  vec2 h = hash2(id);
  vec2 at = fract(g) - 0.5 - (h - 0.5) * 0.7;
  float twinkle = 0.55 + 0.45 * sin(t * (0.5 + h.x) + h.y * 40.0);
  float size = mix(0.02, 0.05, h.x * h.x);
  return smoothstep(size, 0.0, length(at)) * twinkle * step(0.52, h.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  uv.y = 1.0 - uv.y;
  // Distances are measured in screen heights, so the lamp is round on any screen.
  vec2 square = vec2(uRes.x / uRes.y, 1.0);
  vec2 toLamp = uLamp - uv;
  float dist = length(toLamp * square);

  // Coarser steps read a blurrier copy of the map, so a thin stroke is never stepped over.
  float stride = dist / float(${STEPS});
  float lod = log2(max(1.0, stride * uMapSize.y * 0.6));
  float jitter = ign(gl_FragCoord.xy);
  float blocked = 0.0;
  for (int i = 0; i < ${STEPS}; i++) {
    blocked += cover(uv + toLamp * ((float(i) + jitter) / float(${STEPS})), lod);
  }
  float clear = exp(-blocked * stride * 70.0);

  // The lamp: a hot core, taller than it is wide so it fills the space between two letters
  // instead of sitting in it like a full stop, inside a wide, slow falloff.
  float tall = length(toLamp * square * vec2(1.0, mix(0.5, 1.0, uSpread)));
  float core = exp(-tall * tall / mix(0.0024, 0.02, uSpread));
  float reach = mix(0.2, 0.62, uSpread);
  float glow = 1.0 / (1.0 + pow(dist / reach, 2.2));
  // Uneven haze breaks the light into faint beams that turn slowly.
  float angle = atan(toLamp.y * square.y, toLamp.x * square.x);
  float beams = 0.86 + 0.28 * noise(angle * 5.0 + uTime * 0.04) * noise(angle * 13.0 - uTime * 0.03);
  beams = mix(1.0, beams, smoothstep(0.03, 0.3, dist));

  float air = uPower * (core * 1.25 + glow * 0.5);
  float light = air * (0.26 + 0.74 * clear * beams);

  vec2 p = uv * square;
  float motes = dust(p + toLamp * 0.03, 11.0, uTime) + dust(p + toLamp * 0.07, 19.0, uTime * 1.3) * 0.7;
  light += motes * air * clear * 1.6;

  // The page ends on plain ink, so the light has gone by the bottom of the frame.
  light *= 1.0 - smoothstep(0.74, 1.0, uv.y);

  vec3 color = UMBER * smoothstep(0.0, 0.07, light);
  color = mix(color, RUST, smoothstep(0.05, 0.3, light));
  color = mix(color, EMBER, smoothstep(0.24, 0.62, light));
  color = mix(color, TUNGSTEN, smoothstep(0.55, 1.0, light));
  color = mix(color, BONE, smoothstep(0.95, 1.5, light));
  // Dark gradients band on eight-bit screens; a grain smaller than one level hides it.
  color += (ign(gl_FragCoord.xy + 17.0) - 0.5) / 255.0;

  // Light is added to the page, not laid over it.
  outColor = vec4(max(color, 0.0), 0.0);
}`;

const compile = (gl: WebGL2RenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
};

export interface HeroScroll {
  /** 0 with the hero intact, 1 once it has let go. */
  burst: number;
  /** 0 with the name whole, 1 with its two words gone to either side. */
  part: number;
}

interface BacklightProps {
  /** The heading whose `[data-name]` words stand in front of the lamp. */
  name: RefObject<HTMLElement | null>;
  /** True while Zuhayr is talking; the lamp burns with his voice. */
  speaking: boolean;
  /** Read every frame. */
  scroll?: RefObject<HeroScroll>;
  /** Called once the lamp has drawn its first frame. */
  onReady?: () => void;
  /** Called if there is no GPU to draw with, or the browser takes it away, so the caller can show a plain glow instead. */
  onError?: () => void;
  className?: string;
}

/**
 * A lamp burning in haze behind the name. The letters block it, so each one throws a
 * shadow out across the frame, and the shadows swing as the lamp follows the cursor.
 * One full-screen WebGL2 pass.
 */
const Backlight = ({ name, speaking, scroll, onReady, onError, className }: BacklightProps) => {
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
      const fail = () => callbacks.current.onError?.();
      if (!gl) return void fail();

      // Where the worker could not ask, check again here.
      const debug = gl.getExtension("WEBGL_debug_renderer_info");
      if (debug && SOFTWARE.test(String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)))) return void fail();

      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      const program = gl.createProgram();
      if (!vs || !fs || !program) return void fail();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      // Where the driver can compile off the main thread, wait for it instead of blocking.
      const parallel = gl.getExtension("KHR_parallel_shader_compile");
      let linked = !parallel;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // One triangle that covers the screen.
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.disable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);

      const map = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, map);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const sheet = document.createElement("canvas");
      const pen = sheet.getContext("2d", { willReadFrequently: false });
      if (!pen) return void fail();

      let u: Record<
        "res" | "mapSize" | "lamp" | "power" | "spread" | "time" | "part" | "travel",
        WebGLUniformLocation | null
      > | null = null;

      let width = 0;
      let height = 0;
      /** Where the lamp rests, in CSS pixels from the canvas's top left. */
      let restX = 0;
      let restY = 0;
      let travelFirst = 0;
      let travelLast = 0;
      let mapped = false;

      /**
       * Draws the name into the shadow map exactly where the page sets it, the first word in
       * red and the second in green, and finds where the lamp rests behind them.
       */
      const drawMap = () => {
        const heading = name.current;
        const words = heading ? [...heading.querySelectorAll<HTMLElement>("[data-name]")] : [];
        if (!width || !height || words.length < 2) return;
        const frame = canvas.getBoundingClientRect();
        const k = Math.min(MAP_WIDTH, width) / width;
        sheet.width = Math.round(width * k);
        sheet.height = Math.round(height * k);
        pen.setTransform(k, 0, 0, k, 0, 0);
        pen.clearRect(0, 0, width, height);
        pen.globalCompositeOperation = "lighter";
        pen.textBaseline = "alphabetic";

        const boxes = words.map((word, n) => {
          const glyphs = (word.firstElementChild as HTMLElement | null) ?? word;
          const style = getComputedStyle(glyphs);
          const size = parseFloat(style.fontSize);
          // The scroll moves the words with a transform; the map holds them where they start.
          const moved = new DOMMatrixReadOnly(getComputedStyle(word).transform);
          const box = word.getBoundingClientRect();
          const left = box.left - moved.m41 - frame.left;
          const top = box.top - moved.m42 - frame.top;
          const lineHeight = glyphs.offsetHeight;

          pen.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
          pen.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
          const metrics = pen.measureText(glyphs.textContent ?? "");
          // A line box centres the font's own height, which is where the baseline comes from.
          const baseline = top + (lineHeight - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent;
          pen.fillStyle = n === 0 ? "#f00" : "#0f0";
          pen.fillText(glyphs.textContent ?? "", left, baseline);
          return { left, top, right: left + glyphs.offsetWidth, bottom: top + lineHeight, baseline, size };
        });

        const [first, last] = boxes;
        travelFirst = (NAME_TRAVEL * (first.right - first.left)) / width;
        travelLast = (NAME_TRAVEL * (last.right - last.left)) / width;
        if (last.top < first.bottom - first.size * 0.4) {
          // Side by side: the lamp sits behind the space between the words, at the height of the lower case.
          restX = (first.right + last.left) / 2;
          restY = first.baseline - first.size * 0.36;
        } else {
          // One above the other: behind the seam between the lines.
          restX = width * 0.5;
          restY = (first.baseline + last.top + last.size * 0.1) / 2;
        }

        gl.bindTexture(gl.TEXTURE_2D, map);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, sheet);
        gl.generateMipmap(gl.TEXTURE_2D);
        if (u) {
          gl.uniform2f(u.mapSize, sheet.width, sheet.height);
          gl.uniform2f(u.travel, travelFirst, travelLast);
        }
        if (!mapped) {
          lampX = restX;
          lampY = restY;
        }
        mapped = true;
      };

      const resize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        if (!w || !h) return;
        width = w;
        height = h;
        // Soft light needs few pixels: about half the screen's own, and never more than its CSS size.
        const scale = Math.min(1, (window.devicePixelRatio || 1) * 0.5) * (w < 768 ? 1 : 0.75);
        canvas.width = Math.max(2, Math.round(w * scale));
        canvas.height = Math.max(2, Math.round(h * scale));
        gl.viewport(0, 0, canvas.width, canvas.height);
        if (u) gl.uniform2f(u.res, canvas.width, canvas.height);
        drawMap();
      };

      let pointerX = 0;
      let pointerY = 0;
      let pointerOn = 0;
      const onPointer = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        pointerX = e.clientX - rect.left;
        pointerY = e.clientY - rect.top;
        pointerOn = e.pointerType === "mouse" ? 1 : 0;
      };

      let frame = 0;
      let visible = true;
      let ready = false;
      let litAt = 0;
      let lampX = 0;
      let lampY = 0;
      let follow = 0;
      let voice = 0;
      let burst = 0;
      let part = 0;

      const begin = () => {
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(program), gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
          return void fail();
        }
        gl.useProgram(program);
        const uniform = (id: string) => gl.getUniformLocation(program, id);
        u = {
          res: uniform("uRes"),
          mapSize: uniform("uMapSize"),
          lamp: uniform("uLamp"),
          power: uniform("uPower"),
          spread: uniform("uSpread"),
          time: uniform("uTime"),
          part: uniform("uPart"),
          travel: uniform("uTravel"),
        };
        gl.uniform1i(gl.getUniformLocation(program, "uMap"), 0);
        resize();
        ready = true;
        kick();
      };

      let waiting = 0;
      const waitForLink = () => {
        waiting = 0;
        linked ||= Boolean(parallel && gl.getProgramParameter(program, parallel.COMPLETION_STATUS_KHR));
        if (linked) begin();
        else waiting = requestAnimationFrame(waitForLink);
      };

      const smooth = (from: number, to: number, x: number) => {
        const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
        return t * t * (3 - 2 * t);
      };

      const draw = (now: number) => {
        frame = 0;
        if (!ready || !u || !mapped) return;
        const t = now / 1000;
        if (!litAt) {
          // The lamp starts coming up on the first frame that is really drawn, not before.
          litAt = now;
          callbacks.current.onReady?.();
        }

        // Arrival: the lamp comes up behind a name that is already on screen.
        const lit = reduced ? 1 : 1 - Math.pow(1 - Math.min(1, (now - litAt) / 2400), 3);

        const level = speakingRef.current
          ? Math.max(getVoiceLevel(), 0.22 + 0.16 * Math.sin(t * 9) * Math.sin(t * 2.3))
          : 0;
        voice += (level - voice) * 0.18;
        burst += ((scroll?.current.burst ?? 0) - burst) * 0.14;
        part += ((scroll?.current.part ?? 0) - part) * 0.3;

        // The lamp leans toward the cursor and otherwise drifts, slowly, around its rest.
        follow += (pointerOn - follow) * 0.05;
        const sway = reduced ? 0 : 1;
        let targetX = restX + (pointerX - restX) * 0.62 * follow + Math.sin(t * 0.31) * width * 0.022 * sway;
        let targetY = restY + (pointerY - restY) * 0.5 * follow + Math.cos(t * 0.23) * height * 0.03 * sway;
        // Letting go: it comes forward to the middle of the frame and floods it.
        const centre = smooth(0, 0.6, burst);
        targetX += (width * 0.5 - targetX) * centre;
        targetY += (height * 0.5 - targetY) * centre;
        lampX += (targetX - lampX) * 0.07;
        lampY += (targetY - lampY) * 0.07;
        const flare = Math.sin(Math.PI * Math.min(1, burst / 0.75)) ** 2;
        const power = lit * (1 + voice * 0.32) * (1 + flare * 0.9) * (1 - 0.86 * smooth(0.42, 1, burst));

        gl.uniform1f(u.time, reduced ? 0 : t);
        gl.uniform2f(u.lamp, lampX / width, lampY / height);
        gl.uniform1f(u.power, power);
        gl.uniform1f(u.spread, smooth(0.04, 0.85, burst));
        gl.uniform1f(u.part, part);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        // Reduced motion draws on demand; otherwise the lamp is alive while it is on screen.
        if (visible && !document.hidden && (!reduced || speakingRef.current)) frame = requestAnimationFrame(draw);
      };
      const kick = () => {
        if (!frame) frame = requestAnimationFrame(draw);
      };

      waitForLink();
      // The name is measured again once its real typeface is in, and whenever the frame changes.
      document.fonts.ready.then(() => {
        if (cancelled) return;
        drawMap();
        kick();
      });
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
      // A browser short of GPU memory drops the context and the canvas goes blank for good.
      const onLost = () => {
        ready = false;
        fail();
      };
      canvas.addEventListener("webglcontextlost", onLost);
      window.addEventListener("pointermove", onPointer, { passive: true });
      const speakingPoll = reduced ? window.setInterval(() => speakingRef.current && kick(), 250) : 0;

      return () => {
        cancelAnimationFrame(frame);
        cancelAnimationFrame(waiting);
        window.clearInterval(speakingPoll);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        canvas.removeEventListener("webglcontextlost", onLost);
        window.removeEventListener("pointermove", onPointer);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }
  }, [name, scroll]);

  return <canvas ref={canvasRef} aria-hidden className={cn("pointer-events-none block size-full", className)} />;
};

export default Backlight;
