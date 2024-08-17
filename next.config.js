/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        hostname: "images.igdb.com",
      },
    ],
  },
};

module.exports = nextConfig;
