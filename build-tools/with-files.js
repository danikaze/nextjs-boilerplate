/**
 * List of parameters accepted by `withFiles`
 * Basically, a mapping to `url-loader` and `file-loader`
 */
const defaultConfig = {
  /** Files smaller than this will be managed by url-loader */
  inlineImageLimit: 8192,
  /**
   * `publicPath` is only used in production
   * Recommended to be set to an Alias to the real path for better URLs
   */
  publicPath: '/assets',
  postTransformPublicPath: undefined,
  /**
   * `assetPrefix` is only used in production AND when `publicPath` is not
   * defined and it's used as prefix for the real asset path
   * (`${assetPrefix}/_next/static/assets/`), so it can be set to a different
   * domain, etc.
   */
  assetPrefix: '',
  /**
   * The following placeholders are available:
   * https://webpack.js.org/loaders/file-loader/#placeholders
   */
  imageFileName: '[name]-[hash].[ext]',
  /** List of file extensions to handle with url-loader and/or file-loader */
  fileExtensions: [
    'jpg',
    'jpeg',
    'png',
    'svg',
    'gif',
    'ico',
    'webp',
    'jp2',
    'avif',
  ],
};

module.exports = (withFileParams) => ({
  webpack: (config, options) => {
    const IS_PRODUCTION = !options.dev;

    const {
      inlineImageLimit,
      imageFileName,
      publicPath,
      postTransformPublicPath,
      assetPrefix,
      basePath,
      fileExtensions,
      ...nextConfig
    } = { ...defaultConfig, ...withFileParams };

    config.module.rules.push({
      test: new RegExp(`\.(${fileExtensions.join('|')})$`),
      issuer: /\.\w+(?<!(s?c|sa)ss)$/i,
      exclude: nextConfig.exclude,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: inlineImageLimit,
            fallback: 'file-loader',
            name: imageFileName,
            outputPath: 'static/assets/',
            postTransformPublicPath,
            publicPath: IS_PRODUCTION
              ? publicPath || `${assetPrefix}/_next/static/assets/`
              : '/_next/static/assets/',
            esModule: nextConfig.esModule || false,
            emitFile: !options.isServer,
          },
        },
      ],
    });

    if (nextConfig && typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options);
    }

    return config;
  },
});
