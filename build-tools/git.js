const { execSync } = require('child_process');

module.exports = (onError = '') => {
  try {
    const rev = execSync('git rev-parse HEAD').toString().trim();
    const shortRev = execSync('git rev-parse --short HEAD').toString().trim();
    return {
      rev,
      shortRev,
    };
  } catch (e) {
    return {
      rev: onError,
      shortRev: onError,
    };
  }
};
