// /** @type {import('next').NextConfig} */
// const nextConfig = {
//    eslint: {
//     ignoreDuringBuilds: true, 
//   // Enable standalone output for Docker deployments
//   output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,

//   images: {
//     remotePatterns: [
//       { protocol: 'http',  hostname: 'localhost' },
//       { protocol: 'https', hostname: 'images.unsplash.com' },
//       { protocol: 'https', hostname: '*.brokerra.in' },
//     ],
//   } },

//   experimental: {
//     optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
//   },

//   // Security headers
//   async headers() {
//     return [
//       {
//         source: '/(.*)',
//         headers: [
//           { key: 'X-Frame-Options',        value: 'DENY' },
//           { key: 'X-Content-Type-Options',  value: 'nosniff' },
//           { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
//         ],
//       },
//     ]
//   },

//   // Redirect root → landing
//   async redirects() {
//     return [
//       { source: '/', destination: '/landing', permanent: false },
//     ]
//   },
// }

// module.exports = nextConfig


/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'http',  hostname: 'localhost' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.brokerra.in' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',       value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy',        value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/', destination: '/landing', permanent: false },
    ]
  },
}

module.exports = nextConfig