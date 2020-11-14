const { getConstants } = require('../build-tools/build-time-constants');
/*
 * Because server code doesn't work with webpack
 * set the build-time constants into the global context
 * so they can be used the same way (but won't be replaced in building stage)
 *
 * They also need to be declared even before including any other file
 */
(() => {
  const constants = getConstants({
    type: 'custom-server',
    dev: process.env.NODE_ENV !== 'production',
    isServer: true,
  });

  Object.entries(constants).forEach(([key, value]) => {
    // tslint:disable: no-any
    (globalThis as any)[key] = value;
  });
})();

const { run } = require('./server');

run();
