const withBundleAnalyzer = require('@next/bundle-analyzer');
const withFiles = require('./build-tools/with-files');
const withConstants = require('./build-tools/with-constants');
const { i18n } = require('./next-i18next.config');

let config = withConstants();
config = withFiles({
  ...config,
  // inlineImageLimit
  // imageFileName
  // outputPath
  // publicPath
  // postTransformPublicPath
  // assetPrefix
  // basePath
  // fileExtensions
});
config = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(
  config
);

config.future = {
  webpack5: true,
};

config.sassOptions = {};

config.i18n = i18n;

module.exports = config;
