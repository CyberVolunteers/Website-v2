const path = require("path")

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    IS_DEV: process.env.NODE_ENV === "development",

  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config
    return config
  },

  env: {
    baseDir: __dirname
  }
}
