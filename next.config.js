const { getBuildTimeConstantsPlugins } = require('./build-time-constants');

module.exports = {
  webpack: (config, { buildId, dev, isServer, webpack }) => {
    if (!config.plugins) {
      config.plugins = [];
    }

    // add build-time defined constants
    config.plugins.push(
      ...getBuildTimeConstantsPlugins({
        buildId,
        dev,
        isServer,
        webpack,
      })
    );

    return config;
  },
};