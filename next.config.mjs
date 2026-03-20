/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/jacqes-bi",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
