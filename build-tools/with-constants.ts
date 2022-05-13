// tslint:disable: no-any
import { getBuildTimeConstantsPlugins } from './build-time-constants';

export function withConstants(nextConfig?: any) {
  return {
    webpack: (config: any, options: any) => {
      const { buildId, dev, isServer, webpack } = options;

      // add build-time defined constants
      config.plugins.push(
        ...getBuildTimeConstantsPlugins({
          buildId,
          dev,
          isServer,
          webpack,
          type: isServer ? 'server' : 'client',
        })
      );

      if (nextConfig && typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}
