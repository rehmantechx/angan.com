/** @type {import('next').NextConfig} */
const nextConfig = {
  // SECURITY 27 Nov 2026: never send the framework version in a header.
  // An attacker who knows the exact Next.js version can aim known CVEs
  // at the site; the version buys them nothing to know.
  poweredByHeader: false,
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
    // SECURITY 27 Nov 2026: headers the site had none of. The old
    // WordPress site was hacked; this site had no security headers at
    // all, so a browser would happily frame it, sniff content types,
    // and run any script a stored payload smuggled in. These headers
    // cost nothing visible and close those doors:
    // - HSTS: browsers only ever use https for this site.
    // - X-Frame-Options DENY + CSP frame-ancestors: nobody can frame
    //   the site (no clickjacking, no login page inside an attacker's
    //   page). Nothing on the site needs to be framed.
    // - X-Content-Type-Options nosniff: browsers never guess a file
    //   is a script when it is not.
    // - Referrer-Policy: other sites never see the full page URL.
    // - Permissions-Policy: camera, microphone, location and payment
    //   are off everywhere; the site never asks for them.
    // - Content-Security-Policy: only scripts and styles from this
    //   site (plus the inline scripts and styles Next.js itself
    //   needs), images from anywhere https (admin-pasted photo URLs),
    //   network calls only to this site, Google APIs (Firebase) and
    //   Cloudinary (photo upload), frames only YouTube and Google
    //   Maps, no plugins, no framing, forms only to this site.
    //   'unsafe-inline' for scripts and styles is still needed:
    //   Next.js itself writes inline scripts, and Tailwind writes
    //   inline styles. The policy still blocks the worst cases:
    //   scripts from any other site, plugins, and framing.
    //   DEV ONLY: 'unsafe-eval' is added to script-src when the
    //   server is not production. The development server runs its
    //   JavaScript through eval (webpack dev sourcemaps), and the
    //   local test browser drives pages the same way, so without it
    //   every client-rendered page (/admin, /office-login) is blank
    //   in local testing. Production builds use plain script files,
    //   no eval, so the live site keeps the strict policy without it.
    const isProd = process.env.NODE_ENV === "production";
    const scriptSrc = isProd
      ? "script-src 'self' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";
    const securityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains",
      },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          scriptSrc,
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https://*.googleapis.com https://api.cloudinary.com",
          "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.google.com",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
          "frame-ancestors 'self'",
          "upgrade-insecure-requests",
        ].join("; "),
      },
    ];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
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
