/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/jacqes-bi",
  assetPrefix: "/jacqes-bi/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
