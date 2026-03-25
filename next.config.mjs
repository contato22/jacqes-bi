/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/awq",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
