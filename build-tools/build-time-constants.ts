// tslint:disable: no-any no-console

import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { UserConfig } from 'next-i18next';
import { LoggerOptions } from '@utils/logger';
import { getGitData } from './git';
import { requireFromProject } from './require-from-project';
import packageJson from '../package.json';

const i18n: UserConfig['i18n'] | null = requireFromProject(
  `next-i18next.config`,
  null
)?.i18n;

export type BuildType = 'custom-server' | 'server' | 'client';

interface BuildData {
  webpack: any;
  type: BuildType;
  buildId: string;
  dev: boolean;
  isServer: boolean;
  isTest?: boolean;
}

// defined in `build-time-constants/build.d.ts`
interface BuildConstants {
  IS_PRODUCTION: boolean;
  IS_SERVER: boolean;
  IS_TEST: boolean;
  BUILD_ID: string;
  PACKAGE_NAME: string;
  PACKAGE_VERSION: string;
  COMMIT_HASH: string;
  COMMIT_HASH_SHORT: string;
  LOGGER_CONFIG: LoggerOptions;
  I18N_ENABLED: boolean;
  AVAILABLE_LOCALES: string[];
}

const LOGGER_CONFIG_PATH = 'logger.config.js';
const CONSTANTS_PATH = 'build-time-constants';
const allConstants: Record<string, any> = {};
let langTypeDefGenerated = false;

/**
 * Returns an array of webpack plugins ready to be appended to the webpack
 * plugins configuration
 */
export function getBuildTimeConstantsPlugins(buildData: BuildData) {
  const rawConstants = getConstants(buildData);
  const constants = stringify(rawConstants);

  if (!langTypeDefGenerated) {
    addLangTypeDefinition(rawConstants.AVAILABLE_LOCALES);
    langTypeDefGenerated = true;
  }

  const plugins = [new buildData.webpack.DefinePlugin(constants)];

  return plugins;
}

/**
 * Returns an object of the build-time-constants provided by the build and the
 * user-defined files, to be provided to the `webpack.DefinePlugin` or used in
 * `utils/set-build-time-constants.ts` in the custom server.
 */
export function getConstants({
  type,
  buildId,
  dev,
  isServer,
  isTest,
}: BuildData) {
  const constants = getFiles([isServer ? 'server' : 'client']).reduce(
    (res, relFilePath) => {
      const filePath = join(CONSTANTS_PATH, relFilePath);
      const fileData = requireFromProject(filePath);
      return { ...res, ...fileData };
    },
    {}
  );

  const gitData = getGitData();

  const buildConstants: BuildConstants = {
    IS_PRODUCTION: !dev,
    IS_SERVER: isServer,
    IS_TEST: !!isTest,
    BUILD_ID: getBuildId(buildId, dev),
    PACKAGE_NAME: packageJson.name,
    PACKAGE_VERSION: packageJson.version,
    COMMIT_HASH: gitData.rev,
    COMMIT_HASH_SHORT: gitData.shortRev,
    LOGGER_CONFIG: getLoggerConfig(!dev, isServer, isTest),
    I18N_ENABLED: (i18n && i18n.locales && i18n.locales.length > 0) || false,
    AVAILABLE_LOCALES: (i18n && i18n.locales) || [],
  };

  allConstants[type] = {
    ...constants,
    ...buildConstants,
  };

  if (isServer) {
    allConstants[type].PROJECT_ROOT = join(__dirname, '..');
  }

  if (process.env.PRINT_CONSTANTS === 'true') {
    printConstants(type);
  }

  return allConstants[type];
}

function getBuildId(buildId: string, dev: boolean): string {
  if (buildId) return buildId;
  if (dev) return 'development';

  const filePath = join(__dirname, '../.next/BUILD_ID');
  try {
    return readFileSync(filePath).toString();
  } catch (e) {
    return '';
  }
}

function stringify<T extends {}>(data: T): { [key: string]: string } {
  return Object.entries(data).reduce((res, [key, value]) => {
    res[key] = JSON.stringify(value);
    return res;
  }, {} as ReturnType<typeof stringify>);
}

function getFiles(types: ('server' | 'client')[]): string[] {
  const files = types.reduce(
    (files, type) => [...files, type, `${type}-secret`],
    ['global', 'global-secret']
  );

  const folders = (process.env.CONSTANTS_SUBFOLDERS || 'data')
    .split(',')
    .map((f) => f.trim());

  return folders.reduce(
    (allFiles, folder) =>
      allFiles.concat(
        files
          .map((file) => join(folder, `${file}.js`))
          .filter((file) => existsSync(join(CONSTANTS_PATH, file)))
      ),
    [] as ReturnType<typeof getFiles>
  );
}

function printConstants(type: BuildType): void {
  console.log(`Build-time constants for the ${type}`);
  const table = { ...allConstants[type] };
  const printableTable: Record<string, string> = {};
  Object.keys(table)
    .sort()
    .forEach((key) => {
      const value = table[key];
      if (Array.isArray(value)) {
        printableTable[key] = `[${value.join(',')}]`;
      } else if (typeof value === 'object') {
        printableTable[key] = JSON.stringify(value);
      } else {
        printableTable[key] = value;
      }
    });
  console.table(printableTable);
}

function getLoggerConfig(
  isProduction: boolean,
  isServer: boolean,
  isTest?: boolean
): LoggerOptions {
  const NOT_FOUND = 'NOT_FOUND';
  const module = requireFromProject(LOGGER_CONFIG_PATH, NOT_FOUND);
  if (module === NOT_FOUND) return {};

  try {
    const config =
      typeof module === 'function'
        ? module(isProduction, isServer, isTest)
        : module;

    if (!isServer) {
      // remove server logger options so they are not
      // leaked in client side
      delete config.outputFolder;
      delete config.outputFile;
      delete config.maxFiles;
    }

    return config;
  } catch (e) {
    throw new Error('Invalid logger.config.js provided');
  }
}

function addLangTypeDefinition(availableLangs: string[]): void {
  const filePath = join(CONSTANTS_PATH, 'build.d.ts');
  const typeName = 'AvailableLocale';
  const langList =
    availableLangs.length === 0
      ? 'never'
      : availableLangs.map((lang) => `'${lang}'`).join(' | ');
  const typeDefLine = `type ${typeName} = ${langList};\n`;
  const code = readFileSync(filePath).toString();
  const start = code.indexOf(`type ${typeName} =`);

  let newCode: string;
  if (start === -1) {
    newCode = code + typeDefLine;
  } else {
    const end = code.indexOf('\n', start) + 1;
    newCode = code.slice(0, start) + typeDefLine + code.slice(end);
  }

  if (code === newCode) return;
  writeFileSync(filePath, newCode);
}
