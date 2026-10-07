/** @type {import('next').NextConfig} */
module.exports = {
  poweredByHeader: false,
  // Self-contained server bundle for the production Docker image.
  output: 'standalone',
  // The admin console is internal tooling: keep it out of search engines and
  // deny framing entirely.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};
