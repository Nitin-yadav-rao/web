/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  images: {
    // Add remote domains here if profile / project images are hosted externally,
    // e.g. { remotePatterns: [{ protocol: 'https', hostname: 'images.example.com' }] }
    formats: ["image/avif", "image/webp"],
    // The scaffold ships local placeholder SVGs for project thumbnails —
    // allow optimizing local SVGs. Safe here because these are trusted,
    // repo-authored files, not user-supplied uploads.
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  async headers() {
    return [
      {
        // Basic security headers applied to every route.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
