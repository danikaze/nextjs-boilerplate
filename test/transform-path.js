const { relative } = require('path');

module.exports = {
  process(src, filename, config, options) {
    const absPath = `/${relative(config.rootDir, filename)}`
      .replace(/\\/g, '/'); // force '/' (instead of '\' in windows)
    return `module.exports = { default: ${JSON.stringify(absPath)} };`;
  },
};
