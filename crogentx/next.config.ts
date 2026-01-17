import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Turbopack configuration for development
  turbopack: {},
  
  // Webpack configuration for production
  webpack: (config, { isServer }) => {
    // External packages that shouldn't be bundled
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Fix for canvas/node-canvas issues in react-force-graph-2d
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Optimize package imports
  experimental: {
    optimizePackageImports: ['lucide-react', 'd3', 'recharts', 'framer-motion'],
  },
  
  // TypeScript and ESLint configuration
  typescript: {
    // Set to true only if you want to temporarily ignore TS errors
    ignoreBuildErrors: false,
  },
  
 
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;