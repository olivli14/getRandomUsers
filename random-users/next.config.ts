import type { NextConfig } from "next";
// you need to configure the next config to allow images from the randomuser.me API
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
  },
};

export default nextConfig;
