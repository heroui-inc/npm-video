/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: 'scastiel.dev',
    },
  },
}

export default nextConfig
