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
