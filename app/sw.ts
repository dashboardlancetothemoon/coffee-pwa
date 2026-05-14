import {
  defaultCache,
  CACHE_NAMES,
} from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, CacheFirst, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // Show /offline when a navigation fails (no connection)
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
  runtimeCaching: [
    // API: stale-while-revalidate, 1 day
    {
      matcher: /^\/api\/(machines|coffee-types|recipes)/,
      handler: new NetworkFirst({
        cacheName: "api-cache",
        plugins: [
          new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 86400 }),
        ],
      }),
    },
    // Everything else: default Serwist strategy
    ...defaultCache,
  ],
});

serwist.addEventListeners();
