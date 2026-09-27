import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Cloudflare Workers' streaming HTML rewriter. Not available under Node
// (vite dev), where pages are left untouched.
interface RewriterElement {
  getAttribute(name: string): string | null;
  remove(): void;
  replace(content: string, options?: { html: boolean }): void;
}
interface Rewriter {
  on(selector: string, handlers: { element(el: RewriterElement): void }): Rewriter;
  transform(response: Response): Response;
}
declare const HTMLRewriter: (new () => Rewriter) | undefined;

// The SSR HTML is fully rendered, so the app's JS (~160 KB gzipped: React,
// router, route chunks) is only needed for hydration/interactivity — yet as
// <link rel="modulepreload"> + an async module script it was downloaded at
// high priority alongside the hero image and fonts, delaying first paint and
// LCP by ~1.5s on throttled mobile (PageSpeed). This moves both to after the
// window `load` event, or earlier on the first tap/keypress. Until then the
// SSR page is fully visible and plain <a href> links still work.
function deferHydration(request: Request, response: Response): Response {
  if (typeof HTMLRewriter === "undefined" || request.method !== "GET") return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  const path = new URL(request.url).pathname;
  if (path.startsWith("/admin") || path.startsWith("/auth")) return response;

  const preloads: string[] = [];
  const json = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c");
  return new HTMLRewriter()
    .on('link[rel="modulepreload"]', {
      element(el) {
        const href = el.getAttribute("href");
        if (href) preloads.push(href);
        el.remove();
      },
    })
    .on('script[type="module"][src]', {
      element(el) {
        const src = el.getAttribute("src");
        if (!src) return;
        el.replace(
          `<script>(function(w,d){var p=${json(preloads)},s=${json(src)},done=0,ev=["pointerdown","touchstart","keydown"];` +
            `function go(){if(done)return;done=1;ev.forEach(function(e){w.removeEventListener(e,go)});` +
            `p.forEach(function(h){var l=d.createElement("link");l.rel="modulepreload";l.href=h;d.head.appendChild(l)});` +
            `var e=d.createElement("script");e.type="module";e.src=s;d.body.appendChild(e)}` +
            `if(d.readyState==="complete")go();else{w.addEventListener("load",go);` +
            `ev.forEach(function(e){w.addEventListener(e,go,{passive:true})})}})(window,document)</script>`,
          { html: true },
        );
      },
    })
    .transform(response);
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return deferHydration(request, await normalizeCatastrophicSsrResponse(response));
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
