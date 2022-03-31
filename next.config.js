/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'videodelivery.net'],
  },
  experimental: {
    reactRoot: true,
  },
};

module.exports = nextConfig;
