import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

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

export default withNextIntl(nextConfig);