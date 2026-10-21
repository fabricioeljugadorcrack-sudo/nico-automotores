/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    // Fotos de referencia en SVG servidas desde /public. Al optimizador de Next
    // no le gustan los SVG remotos; con unoptimized se sirven tal cual.
    // Cuando cargues fotos reales, podés volver a activar la optimización.
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: { optimizePackageImports: ['lucide-react'] },
};

export default nextConfig;
