/**
 * AWQ GROUP — NEXT.JS STATIC EXPORT CONFIG
 *
 * STAGING NOTE (jacqes-bi):
 *   basePath '/awq' mirrors the production path at contato22.github.io/awq/
 *   Staging URL: contato22.github.io/jacqes-bi/awq/
 *
 * MIGRATION TO contato22/awq (1:1):
 *   1. Remove basePath (repo name already provides /awq/ prefix on GitHub Pages)
 *   2. All routes, selectors, components migrate unchanged
 *   3. Re-add API routes (app/api/) for server-runtime environments (Vercel/Node)
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/awq",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
