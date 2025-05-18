import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add transpilePackages to prevent issues with problematic packages
  transpilePackages: ['@auth/prisma-adapter'],
  // Fix experimental configuration
  experimental: {
    // Server Actions are now enabled by default in Next.js 14+
  },
  // Configure allowed image domains
  images: {
    domains: ['images.unsplash.com'],
  },
  // Skip type checking during build for faster builds
  typescript: {
    // Specify ignoreBuildErrors to ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Ignore ESLint warnings/errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Properly handle server-only packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use node-polyfill-webpack-plugin for browser builds
      config.plugins.push(new NodePolyfillPlugin());
      
      // Also maintain our previous fallbacks for safety
      config.resolve.alias = {
        ...config.resolve.alias,
        'node:child_process': false,
        'node:fs': false,
        'node:path': false,
        'node:os': false,
        'node:crypto': false,
        'node:util': false,
        'node:url': false,
        'node:stream': false,
        'node:http': false,
        'node:https': false,
        'node:zlib': false,
        'node:net': false,
        'node:tls': false,
        'node:dns': false,
        'node:events': false,
        'child_process': false,
        'fs': false
      };
    }
    return config;
  },
};

export default nextConfig;
