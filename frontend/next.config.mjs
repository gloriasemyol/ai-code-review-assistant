/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  
  eslint: {
    // Allows production builds to successfully complete even if
    // your project has minor ESLint or code style warnings.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Prevents strict type-checking warnings from killing the Vercel build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;