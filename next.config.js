const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/**
 * Medusa Cloud-related environment variables
 */
const S3_HOSTNAME = process.env.MEDUSA_CLOUD_S3_HOSTNAME
const S3_PATHNAME = process.env.MEDUSA_CLOUD_S3_PATHNAME

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The two guides moved from /pages/* into the /tudastar content hub.
    return [
      // Retire the pre-migration English storefront. Keeping these URLs alive
      // lets stale product photos/copy (and old review snippets) remain in the
      // search index and social previews.
      {
        source: "/en",
        destination: "/hu",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/hu/:path*",
        permanent: true,
      },
      {
        source: "/:countryCode/content/privacy-policy",
        destination: "/:countryCode/pages/adatkezeles",
        permanent: true,
      },
      {
        source: "/:countryCode/content/terms-of-use",
        destination: "/:countryCode/pages/aszf",
        permanent: true,
      },
      {
        source: "/:countryCode/pages/matcha-keszites",
        destination: "/:countryCode/tudastar/matcha-keszites",
        permanent: true,
      },
      {
        source: "/:countryCode/pages/matcha-vs-kave",
        destination: "/:countryCode/tudastar/matcha-vs-kave",
        permanent: true,
      },
    ]
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    // Barrel imports like `import { Button } from "@medusajs/ui"` pull the
    // whole library (incl. an unused Prism syntax highlighter) into every
    // page's client bundle — Lighthouse flagged ~150KB unused JS. This
    // rewrites them to per-module imports so only used components ship.
    optimizePackageImports: ["@medusajs/ui", "@medusajs/icons"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        // Brand/product images hosted in this storefront's own public/ folder
        // and referenced by absolute momomatcha.hu URLs from Medusa products.
        protocol: "https",
        hostname: "momomatcha.hu",
      },
      {
        protocol: "https",
        hostname: "www.momomatcha.hu",
      },
      ...(S3_HOSTNAME && S3_PATHNAME
        ? [
            {
              protocol: "https",
              hostname: S3_HOSTNAME,
              pathname: S3_PATHNAME,
            },
          ]
        : []),
    ],
  },
}

module.exports = nextConfig
