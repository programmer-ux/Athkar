import type { NextConfig } from 'next';
// No longer needed since we have actual PWA config
// const withPWA = require('@ducanh2912/next-pwa').default({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development', // Disable PWA in development
// });

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Add experimental PWA support if not using a dedicated package
   experimental: {
     // pwa: true // Example, check Next.js docs for current PWA flags
   },
   // If using @ducanh2912/next-pwa, configuration goes here if not wrapping `nextConfig`
   // pwa: {
   //  dest: 'public',
   //  register: true,
   //  skipWaiting: true,
   // },
};

// Wrap the config with the PWA plugin if using @ducanh2912/next-pwa
// export default withPWA(nextConfig);

// If using experimental flags or built-in support, export directly
export default nextConfig;
