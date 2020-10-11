const { join } = require('path');

module.exports = {
  SERVER_DEFAULT_PORT: 3000,
  PROJECT_ROOT: join(__dirname, '..'),
  LOCALES_PATH: join(__dirname, '../public/static/locales'),
};
