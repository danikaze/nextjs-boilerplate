/**
 * Because the custom server doesn't accept webpack
 * due to the tsc compilation, routes are different in development/production
 * Later, PROJECT_ROOT can be used but this is done before it's available
 */
const getConstants = (() => {
  const file =
    process.env.NODE_ENV !== 'production'
      ? '../build-tools/build-time-constants'
      : '../../build-tools/build-time-constants';

  return require(file).getConstants as (options: {
    type: 'custom-server' | 'server' | 'client';
    dev: boolean;
    isServer: boolean;
    buildId?: string;
  }) => { [key: string]: unknown };
})();

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
