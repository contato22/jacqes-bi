/** @type {import('next').NextConfig} */

// STATIC_EXPORT=1 → GitHub Pages (sem API routes)
// default           → Vercel/Node (SSR + rotas dinâmicas)
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport
    ? {
        output: "export",
        basePath: "/advisor-bi",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
