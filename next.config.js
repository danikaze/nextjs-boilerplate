const withBundleAnalyzer = require('@next/bundle-analyzer');
const {
  requireFromProject,
} = require('./dist/build-tools/require-from-project');
const { withConstants } = requireFromProject('build-tools/with-constants');
const { i18n } = requireFromProject('next-i18next.config');

let config = withConstants();
config.webpack5 = true;
config.sassOptions = {};
config.i18n = i18n;

if (process.env.ANALYZE === 'true') {
  config = withBundleAnalyzer()(config);
}

module.exports = config;
