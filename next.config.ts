import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'backendstack-product-images-bucket.s3.amazonaws.com',

        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
