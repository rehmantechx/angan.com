/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // No AVIF (26 Nov 2026): the optimizer generated AVIF variants on a
    // cold cache, 1-4s per image on first load of /projects, /societies
    // and /about. WebP stays, JPEG is the fallback for browsers without
    // WebP. No image file itself was changed.
    formats: ["image/webp"],
    // QUALITY 25 Nov 2026: 1920 added, so the optimizer serves a
    // 1920px variant for the full-width hero instead of upscaling
    // the 1200px one. The hero shows up to 1920px wide plus a 1.08
    // Ken Burns zoom, so a 1200px source was always upscaled and
    // blurry.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    // Admin-set image URLs (hero slides, banner images, project card
    // images) can be any real https link the office pastes in, so the
    // optimizer must accept any https host. Local /img files are
    // unaffected.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
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
