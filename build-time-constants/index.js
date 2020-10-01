/*
 * Don't touch this file.
 * This is used internally by the webpack configurations
 */
const { join } = require('path');
const { existsSync } = require('fs');
const packageJson = require('../package.json');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = { getBuildTimeConstantsPlugins };

const allConstants = {};

function getBuildTimeConstantsPlugins(buildData) {
  const constants = getConstants(buildData);

  const plugins = [
    gitRevisionPlugin,
    new buildData.webpack.DefinePlugin(constants),
  ];

  return plugins;
}

function getConstants({ buildId, dev, isServer }) {
  const type = isServer ? 'server' : 'client';
  const constants = getFiles(type).reduce((res, filePath) => {
    const fileData = require(filePath);
    return { ...res, ...fileData };
  }, {});

  if (buildId) constants.BUILD_ID = buildId;
  if (isServer !== undefined) {
    constants.IS_SERVER = isServer;
  }
  constants.IS_PRODUCTION =
    dev !== undefined ? !dev : process.env.NODE_ENV === 'production';

  allConstants[type] = {
    ...constants,
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    COMMIT_HASH: gitRevisionPlugin.commithash(),
    COMMIT_HASH_SHORT: gitRevisionPlugin.commithash().substr(0, 7),
  };

  if (dev && allConstants.server && allConstants.client) {
    printConstants();
  }

  return stringify(allConstants[type]);
}

function stringify(data) {
  return Object.entries(data).reduce((res, [key, value]) => {
    res[key] = JSON.stringify(value);
    return res;
  }, {});
}

function getFiles(type) {
  const files = ['global', 'global-secret', type, `${type}-secret`];

  return files
    .map((file) => join(__dirname, `${file}.js`))
    .filter((file) => existsSync(file));
}

function printConstants() {
  console.log('Build-time constants for the server:');
  console.table(allConstants.server);
  console.log('Build-time constants for the client:');
  console.table(allConstants.client);
}
