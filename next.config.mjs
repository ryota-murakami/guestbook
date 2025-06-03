/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs')

/** @type {import("next").NextConfig} */
const config = {
  // i18n configuration has been removed as it's not supported in App Router
  reactStrictMode: true,
}
export default config
