// tslint:disable: no-console
import {
  existsSync,
  statSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname, join, relative, resolve, extname } from 'path';
import tsConfig from '../tsconfig.json';
import tsConfigServer from '../server/tsconfig.json';

type TsConfigPaths = Record<string, string[]>;

const VERBOSE =
  process.argv.includes('--print-replacements') ||
  process.env.PRINT_ALIAS_REPLACEMENTS === 'true';
const BASE_PATH = resolve(
  join(__dirname, '..', tsConfig.compilerOptions.baseUrl)
);
const DIST_PATH = join(
  BASE_PATH,
  'server',
  tsConfigServer.compilerOptions.outDir
);

function getJsFiles(baseFolder: string, list: string[] = []): string[] {
  readdirSync(baseFolder).forEach((filename) => {
    const fullPath = join(baseFolder, filename);
    if (statSync(fullPath).isDirectory()) {
      return getJsFiles(fullPath, list);
    }
    if (extname(fullPath) !== '.js') return;
    list.push(fullPath);
  });
  return list;
}

function replaceAliases(paths: TsConfigPaths, filePath: string): number {
  const code = readFileSync(filePath).toString();
  const rel = relative(dirname(filePath), DIST_PATH).replace(/\\/g, '/');
  const changes: [original: string, replaced: string][] = [];

  function replacePath(original: string, replaced: string): string {
    const match = /require\("([^"]+)"\)/.exec(original)!;
    changes.push([match[1], replaced]);
    return `= require("${replaced}")`;
  }

  const newCode = Object.entries(paths).reduce(
    (replacedCode, [alias, targets]) => {
      if (alias.substring(alias.length - 2) === '/*') {
        // relative import (i.e. "@api/*": ["api/*"])
        const aliasFolder = alias.substring(0, alias.length - 2);
        const re = new RegExp(
          `= require\\(["']${aliasFolder}/([^"']+)["']\\)`,
          'g'
        );
        return replacedCode.replace(re, (match, path) => {
          for (const target of targets) {
            const targetFile = `${target.substring(
              0,
              target.length - 2
            )}/${path}`;
            const targetPath = join(dirname(filePath), rel, targetFile);
            if (!existFile(targetPath)) continue;
            return replacePath(match, `${rel}/${targetFile}`);
          }
          return match;
        });
      }

      // exact import (i.e. "@_app": ["pages/_app"])
      const re = new RegExp(`= require\\(["']${alias}["']\\)`, 'g');
      return replacedCode.replace(re, (match) => {
        for (const target of targets) {
          const targetPath = join(dirname(filePath), rel, target);
          if (!existFile(targetPath)) continue;
          return replacePath(match, `${rel}/${target}`);
        }
        return match;
      });
    },
    code
  );

  writeFileSync(filePath, newCode);

  if (VERBOSE && changes.length > 0) {
    console.log(filePath);
    for (const [original, replaced] of changes) {
      console.log(` * ${original} => ${replaced}`);
    }
  }
  return changes.length;
}

function existFile(filePath: string): boolean {
  return (
    existsSync(filePath) ||
    existsSync(`${filePath}.js` || `${filePath}/index.js`)
  );
}

function run(): void {
  if (
    !tsConfig.compilerOptions.paths ||
    Object.keys(tsConfig.compilerOptions.paths).length === 0
  ) {
    console.log('No paths defined');
    return;
  }

  const jsFiles = getJsFiles(DIST_PATH);
  const [totalReplacements, filesChanged] = jsFiles.reduce(
    ([totalReplacements, filesChanged], file) => {
      const replacements = replaceAliases(tsConfig.compilerOptions.paths, file);
      return [
        totalReplacements + replacements,
        filesChanged + (replacements > 0 ? 1 : 0),
      ];
    },
    [0, 0]
  );
  console.log(
    `${
      VERBOSE ? '\n' : ''
    }${totalReplacements} TS aliases replaced in ${filesChanged}/${
      jsFiles.length
    } files${
      VERBOSE
        ? ''
        : ' (use process.env.PRINT_ALIAS_REPLACEMENTS=true to show more details)'
    }`
  );
}

run();
