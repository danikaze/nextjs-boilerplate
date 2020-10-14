/**
 * Exporting an object here can change the settings of the global logger
 * provided in the application
 *
 * The interface for this config object and default values can be found in
 * [utils/logger/index.ts]
 *
 * Exporting a function is also possible, and it will accept a boolean set
 * to `true` if the environment is production, `false` if development
 */
module.exports = (isProduction) => ({});
