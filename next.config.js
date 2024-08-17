/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["imgur.com", "i.imgur.com", "images.igdb.com"],
  },
  output: 'standalone',
};

module.exports = nextConfig;
