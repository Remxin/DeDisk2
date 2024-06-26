const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  pwa: {
    disable: process.env.NODE_ENV === "development"
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // async redirects() {
  //   return [
  //     {
  //       source
  //     }
  //   ]
  // }
}

module.exports = nextConfig
