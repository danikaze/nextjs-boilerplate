/*
 * Don't touch this file.
 * This is used internally by the webpack configurations
 */
const { join } = require('path');
const {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} = require('fs');
const packageJson = require('../package.json');
const GitRevisionPlugin = require('git-revision-webpack-plugin');

const gitRevisionPlugin = new GitRevisionPlugin();

module.exports = { getConstants, getBuildTimeConstantsPlugins };

const CONSTANTS_PATH = join(__dirname, '../build-time-constants');
const LOCALES_PATH = join(__dirname, '../public/static/locales');
const LOCALES_URL = '/static/locales';
const allConstants = {};
let availableLangs;
let langTypeDefGenerated = false;

function getBuildTimeConstantsPlugins(buildData) {
  const rawConstants = getConstants(buildData);
  const constants = stringify(rawConstants);

  if (!langTypeDefGenerated) {
    addLangTypeDefinition(rawConstants.AVAILABLE_LANGUAGES);
    langTypeDefGenerated = true;
  }

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
    LOCALES_URL: LOCALES_URL,
    AVAILABLE_LANGUAGES: getAvailableLanguages(LOCALES_PATH),
  };

  if (/server/.test(type)) {
    allConstants[type].PROJECT_ROOT = join(__dirname, '..');
    allConstants[type].LOCALES_PATH = LOCALES_PATH;
  }

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
    .map((file) => join(CONSTANTS_PATH, `${file}.js`))
    .filter((file) => existsSync(file));
}

function printConstants(type) {
  console.log(`Build-time constants for the ${type}:`);
  const printableTable = { ...allConstants[type] };
  Object.entries(printableTable).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      printableTable[key] = `[${value.join(',')}]`;
    }
  });
  console.table(printableTable);
}

function getAvailableLanguages(localesPath) {
  if (availableLangs) return availableLangs;
  const list = [];

  readdirSync(localesPath).forEach((filename) => {
    const absPath = join(localesPath, filename);
    const stats = statSync(absPath);
    if (!stats.isDirectory(stats)) return;
    list.push(filename);
  });

  availableLangs = list;
  return list;
}

function addLangTypeDefinition(availableLangs) {
  const filePath = join(CONSTANTS_PATH, 'build.d.ts');
  const typeName = 'AVAILABLE_LANGUAGE_TYPE';
  const langList =
    availableLangs.length === 0
      ? 'never'
      : availableLangs.map((lang) => `'${lang}'`).join(' | ');
  const typeDefLine = `type ${typeName} = ${langList};\n`;
  const code = readFileSync(filePath);
  const start = code.indexOf(`type ${typeName} =`);

  let newCode;
  if (start === -1) {
    newCode = code + typeDefLine;
  } else {
    const end = code.indexOf('\n', start) + 1;
    newCode = code.slice(0, start) + typeDefLine + code.slice(end);
  }

  if (code === newCode) return;
  writeFileSync(filePath, newCode);
}
