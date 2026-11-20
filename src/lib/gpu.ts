/** Renderer names that mean WebGL is being drawn on the CPU. */
export const SOFTWARE = /swiftshader|llvmpipe|software|basic render/i;

let hardware: Promise<boolean> | null = null;

/**
 * Whether WebGL here is backed by a real GPU. On a software rasterizer, just
 * creating a context can hold the main thread for over a second, so the
 * question is asked from a throwaway worker and the page never feels it.
 */
export const hasHardwareWebGL = () =>
  (hardware ??= new Promise<boolean>((resolve) => {
    if (typeof OffscreenCanvas === "undefined" || typeof Worker === "undefined") return resolve(true);
    const probe = `try{const g=new OffscreenCanvas(1,1).getContext("webgl2"),d=g&&g.getExtension("WEBGL_debug_renderer_info");postMessage(g?(d?String(g.getParameter(d.UNMASKED_RENDERER_WEBGL)):"unknown"):"unsupported")}catch(e){postMessage("unsupported")}`;
    try {
      const url = URL.createObjectURL(new Blob([probe], { type: "text/javascript" }));
      const worker = new Worker(url);
      const finish = (ok: boolean) => {
        window.clearTimeout(timer);
        worker.terminate();
        URL.revokeObjectURL(url);
        resolve(ok);
      };
      // No answer in time means the machine is struggling; treat it like software.
      const timer = window.setTimeout(() => finish(false), 5000);
      // "unsupported" only says the worker could not make a context; the page still may.
      worker.onmessage = (e: MessageEvent<string>) => finish(!SOFTWARE.test(e.data));
      worker.onerror = () => finish(true);
    } catch {
      resolve(true);
    }
  }));
