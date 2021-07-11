const withBundleAnalyzer = require('@next/bundle-analyzer');
const withConstants = require('./build-tools/with-constants');
const { i18n } = require('./next-i18next.config');

let config = withConstants();
config.webpack5 = true;
config.sassOptions = {};
config.i18n = i18n;

if (process.env.ANALYZE === 'true') {
  config = withBundleAnalyzer()(config);
}

module.exports = config;
