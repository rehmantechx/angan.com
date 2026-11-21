/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  experimental: { legacyBrowsers: false },
  async headers() {
    return [
      {
        source: "/img/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
