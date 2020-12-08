/**
 * Exporting an object here can change the settings of the global logger
 * provided in the application
 *
 * The interface for this config object and default values can be found in
 * [utils/logger/index.ts]
 *
 * Exporting a function is also possible, and it will accept two boolean
 * params defining if the configuration is for a production or development
 * environment, and if it's for server or client
 * ```
 * (isProduction: boolean, isServer: boolean, isTest: boolean) => LoggerOptions
 * ```
 */
module.exports = (isProduction, isServer, isTest) => ({
  addTimestamp: isServer,
});
