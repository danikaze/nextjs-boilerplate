// Define build time constants in runtime before anything else
(() => {
  const {
    setBuildTimeConstants,
  } = require('../utils/set-build-time-constants');

  setBuildTimeConstants({
    type: 'custom-server',
    dev: process.env.NODE_ENV !== 'production',
    isServer: true,
  });
})();

// Run the server
require('./server').run();
