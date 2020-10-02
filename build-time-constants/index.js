/*
 * Don't touch this file.
 * This is used internally by the webpack configurations
 */
const { join } = require('path');
const { existsSync, readFileSync } = require('fs');
const packageJson = require('../package.json');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = { getConstants, getBuildTimeConstantsPlugins };

const allConstants = {};

function getBuildTimeConstantsPlugins(buildData) {
  const constants = stringify(getConstants(buildData));

  const plugins = [
    gitRevisionPlugin,
    new buildData.webpack.DefinePlugin(constants),
  ];

  return plugins;
}

function getConstants({ type, buildId, dev, isServer }) {
  const constants = getFiles(type).reduce((res, filePath) => {
    const fileData = require(filePath);
    return { ...res, ...fileData };
  }, {});

  allConstants[type] = {
    ...constants,
    IS_PRODUCTION: !dev,
    IS_SERVER: isServer,
    BUILD_ID: getBuildId(buildId, dev),
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    COMMIT_HASH: gitRevisionPlugin.commithash(),
    COMMIT_HASH_SHORT: gitRevisionPlugin.commithash().substr(0, 7),
  };

  if (dev) {
    printConstants(type);
  }

  return allConstants[type];
}

function getBuildId(buildId, dev) {
  if (buildId) return buildId;
  if (dev) return 'development';

  const filePath = join(__dirname, '../.next/BUILD_ID');
  try {
    return readFileSync(filePath).toString();
  } catch (e) {
    return '';
  }
}

function stringify(data) {
  return Object.entries(data).reduce((res, [key, value]) => {
    res[key] = JSON.stringify(value);
    return res;
  }, {});
}

function getFiles(type) {
  if (/server/.test(type)) {
    // load the same files for the server and custom-server
    type = 'server';
  }
  const files = ['global', 'global-secret', type, `${type}-secret`];

  return files
    .map((file) => join(__dirname, `${file}.js`))
    .filter((file) => existsSync(file));
}

function printConstants(type) {
  console.log(`Build-time constants for the ${type}:`);
  console.table(allConstants[type]);
}
