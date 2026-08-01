import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "netrinoimages.s3.eu-west-2.amazonaws.com",
        port: "",
        pathname: "/**", 
      },
    ],
  },
};

export default nextConfig;