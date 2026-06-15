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

    // firebsae api keys
    API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,

    // FLEXPAIE API
    FLEXPAIE_TOKEN: process.env.FLEXPAIE_TOKEN,
    FLEXPAIE_URL_API_CHECK_ORDER: process.env.FLEXPAIE_URL_API_CHECK_ORDER,
    FLEXPAIE_MERCHANT_CODE: process.env.FLEXPAIE_MERCHANT_CODE,
    FLEXPAIE_URL_API: process.env.FLEXPAIE_URL_API,
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
