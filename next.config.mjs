/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/jacqes-bi',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
