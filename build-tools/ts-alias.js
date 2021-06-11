const {
  existsSync,
  statSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} = require('fs');
const { dirname, join, relative, resolve, extname } = require('path');
const tsConfig = require('../tsconfig.json');
const tsConfigServer = require('../server/tsconfig.json');

if (
  !tsConfig.compilerOptions.paths ||
  Object.keys(tsConfig.compilerOptions.paths).length === 0
) {
  console.log('No paths defined');
  return;
}

const basePath = resolve(
  join(__dirname, '..', tsConfig.compilerOptions.baseUrl)
);
const distPath = join(
  basePath,
  'server',
  tsConfigServer.compilerOptions.outDir
);

let aliasesFixed = 0;
const jsFiles = getJsFiles(distPath);
jsFiles.forEach(replaceAliases.bind(undefined, tsConfig.compilerOptions.paths));
console.log(`${aliasesFixed} TS aliases replaced in ${jsFiles.length} files`);

function getJsFiles(baseFolder, list = []) {
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

function replaceAliases(paths, filePath) {
  const code = readFileSync(filePath).toString();
  const rel = relative(dirname(filePath), distPath).replace(/\\/g, '/');

  const newCode = Object.entries(paths).reduce(
    (replacedCode, [alias, targets]) => {
      if (alias.substr(-2, 2) === '/*') {
        // relative import
        const aliasFolder = alias.substr(0, alias.length - 2);
        const re = new RegExp(
          `= require\\(["']${aliasFolder}/([^"']+)["']\\)`,
          'g'
        );
        return replacedCode.replace(re, (match, path) => {
          for (const target of targets) {
            const targetFile = `${target.substr(0, target.length - 2)}/${path}`;
            const targetPath = join(dirname(filePath), rel, targetFile);
            if (!existFile(targetPath)) continue;
            aliasesFixed++;
            return `= require("${rel}/${targetFile}")`;
          }
          return match;
        });
      } else {
        // exact import
        const re = new RegExp(`= require\\(["']${alias}["']\\)`, 'g');
        return replacedCode.replace(re, (match) => {
          for (const target of targets) {
            const targetPath = join(dirname(filePath), rel, target);
            if (!existFile(targetPath)) continue;
            aliasesFixed++;
            return `= require("${rel}/${target}")`;
          }
          return match;
        });
      }
    },
    code
  );

  writeFileSync(filePath, newCode);
}

function existFile(filePath) {
  return (
    existsSync(filePath) ||
    existsSync(`${filePath}.js` || `${filePath}/index.js`)
  );
}
