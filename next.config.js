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

module.exports = config;
