interface SetBuildTimeConstantsOptions {
  type: 'client' | 'server' | 'custom-server';
  dev: boolean;
  isServer: boolean;
  isTest?: boolean;
}

/*
 * The code running under the server and the test build don't go through
 * webpack and because of that, build-time constants are not available
 * in the same way (they are not replaced in the building stage).
 *
 * This function sets those values into the global context so they can be
 * used in the same way (but accessed, not replaced).
 *
 * To use them, this function needs to be called even before including any
 * other file that could reference those constants to avoid errors.
 */
export function setBuildTimeConstants(
  options: SetBuildTimeConstantsOptions
): void {
  const constants = getConstants(options);

  Object.entries(constants).forEach(([key, value]) => {
    // tslint:disable-next-line: no-any
    (globalThis as any)[key] = value;
  });
}

/**
 * Because the custom server doesn't accept webpack due to the tsc compilation,
 * routes are different in development/production
 * Later, `PROJECT_ROOT` can be used but this is done before it's available
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
