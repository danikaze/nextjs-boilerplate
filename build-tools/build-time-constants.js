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
const getGitData = require('./git');

module.exports = { getConstants, getBuildTimeConstantsPlugins };

const LOGGER_CONFIG_PATH = join(__dirname, '../logger.config.js');
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

  const plugins = [new buildData.webpack.DefinePlugin(constants)];

  return plugins;
}

function getConstants({ type, buildId, dev, isServer, isTest }) {
  const constants = getFiles(isServer ? 'server' : 'client').reduce(
    (res, filePath) => {
      const fileData = require(filePath);
      return { ...res, ...fileData };
    },
    {}
  );

  const gitData = getGitData();

  allConstants[type] = {
    ...constants,
    IS_PRODUCTION: !dev,
    IS_SERVER: isServer,
    IS_TEST: !!isTest,
    BUILD_ID: getBuildId(buildId, dev),
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    COMMIT_HASH: gitData.rev,
    COMMIT_HASH_SHORT: gitData.shortRev,
    LOCALES_URL: LOCALES_URL,
    AVAILABLE_LANGUAGES: getAvailableLanguages(LOCALES_PATH),
    LOGGER_CONFIG: getLoggerConfig(!dev, isServer, isTest),
  };

  if (isServer) {
    allConstants[type].PROJECT_ROOT = join(__dirname, '..');
    allConstants[type].LOCALES_PATH = LOCALES_PATH;
  }

  if (process.env.PRINT_CONSTANTS === 'true') {
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
  const files = ['global', 'global-secret', type, `${type}-secret`];
  const folders = (process.env.CONSTANTS_SUBFOLDERS || 'data')
    .split(',')
    .map((f) => join(CONSTANTS_PATH, f.trim()));

  return folders.reduce(
    (allFiles, folder) =>
      allFiles.concat(
        files
          .map((file) => join(folder, `${file}.js`))
          .filter((file) => existsSync(file))
      ),
    []
  );
}

function printConstants(type) {
  console.log(`Build-time constants for the ${type}:`);
  const printableTable = { ...allConstants[type] };
  Object.entries(printableTable).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      printableTable[key] = `[${value.join(',')}]`;
    } else if (typeof value === 'object') {
      printableTable[key] = JSON.stringify(value);
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

function getLoggerConfig(isProduction, isServer, isTest) {
  if (!existsSync(LOGGER_CONFIG_PATH)) return {};

  try {
    const module = require(LOGGER_CONFIG_PATH);
    const config =
      typeof module === 'function'
        ? module(isProduction, isServer, isTest)
        : module;

    if (!isServer) {
      // remove server logger options so they are not
      // filtered into the client side
      delete config.outputFolder;
      delete config.outputFile;
      delete config.maxFiles;
    }

    return config;
  } catch (e) {
    throw new Error('Invalid logger.config.js provided');
  }
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
