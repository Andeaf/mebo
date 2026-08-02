import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Dev-only: allow viewing the dev server via 127.0.0.1 as well as localhost
  allowedDevOrigins: ["127.0.0.1"],
};

export default withNextIntl(nextConfig);
