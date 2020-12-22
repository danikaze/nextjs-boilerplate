const { getBuildTimeConstantsPlugins } = require('./build-time-constants');

module.exports = (nextConfig) => ({
  webpack: (config, options) => {
    const { buildId, dev, isServer, webpack } = options;

    // add build-time defined constants
    config.plugins.push(
      ...getBuildTimeConstantsPlugins({
        type: isServer ? 'server' : 'client',
        buildId,
        dev,
        isServer,
        webpack,
      })
    );

    if (nextConfig && typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});
