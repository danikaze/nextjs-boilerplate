const withBundleAnalyzer = require('@next/bundle-analyzer');
const withFiles = require('./build-tools/with-files');
const withConstants = require('./build-tools/with-constants');

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

module.exports = config;
