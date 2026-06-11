import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  env: {
    // DATABASE
    DATABASE_URL: process.env.DATABASE_URL,

    // AUTH_SECRET
    AUTH_SECRET: process.env.AUTH_SECRET,

    // GOOGLE OAUTH
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_SECRET:
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "3eqaz12yan4rgf7v.public.blob.vercel-storage.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
