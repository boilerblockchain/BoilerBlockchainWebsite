/**
 * The app is served under a sub-path of the main site (boilerblockchain.org
 * proxies /attendance/* to this deployment), so every URL it builds by hand
 * has to carry that prefix.
 *
 * next/link, next/navigation and the asset pipeline pick up `basePath` from
 * next.config.ts on their own. `fetch()` does not: a bare "/api/checkin" would
 * resolve against the origin and hit the main site's SPA instead of this app.
 * Route every hand-written path through `apiPath` / `withBasePath`.
 */
export const BASE_PATH = "/attendance";

/** Prefix an app-absolute path (e.g. "/checkin/3") with the base path. */
export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

/** Prefix an API route path (e.g. "/api/checkin") with the base path. */
export function apiPath(path: string): string {
  return withBasePath(path);
}
