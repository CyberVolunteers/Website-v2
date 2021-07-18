const path = require("path")

module.exports = {
  reactStrictMode: true,

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Important: return the modified config

    Object.assign(config.resolve.alias, {
      // mongoUtils: path.resolve(__dirname, './mongoUtils/'),
      // lib: path.resolve(__dirname, './'),
    });

    return config
  },
}
