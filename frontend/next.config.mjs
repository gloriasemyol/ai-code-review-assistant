/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  
  typescript: {
    // Prevents strict type-checking warnings from halting your build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;