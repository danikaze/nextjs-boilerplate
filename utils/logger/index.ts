import { createContext, useContext } from 'react';
// this require (instead of import) is to avoid including
// server side files in the client build
export const IsomorphicLogger: IsomorphicLoggerConstructor = IS_SERVER
  ? require('./private/server').ServerLogger
  : require('./private/client').ClientLogger;

export const globalLogger = new IsomorphicLogger(LOGGER_CONFIG);
export const Logger = createContext<IsomorphicLogger>(globalLogger);
Logger.displayName = 'Logger';

export interface IsomorphicLoggerConstructor {
  new (options?: LoggerOptions): IsomorphicLogger;
}

export interface IsomorphicLogger {
  getLogger(namespace: string): NsLogger;
}

export type LoggerLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug';

/**
 * Global logger instance can be customized by editing `/logger.config.js`
 */
export interface LoggerOptions {
  /**
   * Maximum severity level to log
   *
   * Default: `error` in production, `debug` in develop mode
   */
  level?: LoggerLevel;
  /**
   * If `true`, nothing will be logged
   *
   * Default: `false`
   */
  silent?: boolean;
  /**
   * Enables logging to the console (client + server side)
   *
   * Default: `false` in production or tests, `true` in develop mode
   */
  console?: boolean;
  /**
   * Disable colors in the logs
   *
   * Usually is always better to have colors in client side.
   * For server side, it's better enabled if logs are checked using
   * console commands that support colors, such as `tail`, `cat` or `grep`
   * but better to disable them if looking to the raw files directly
   *
   * Default: `false`
   */
  disableColors?: boolean;
  /**
   * If `false`, the timestamp won't be added in the log messages
   *
   * Default: `true`
   */
  addTimestamp?: boolean;
  /**
   * Folder where to write the logs files (server side only)
   * It is required if `outputFile` is defined
   *
   * Default: `logs`
   */
  outputFolder?: string;
  /**
   * If specified, enables logging to a file (server side only)
   * Relative to `outputFolder`
   *
   * Default: `%DATE%.log`
   */
  outputFile?: string;
  /**
   * Maximum number of logs to keep
   * Set to `undefined` to disable the limit
   *
   * Default: `30`
   */
  maxFiles?: number;
}

export type LogFunction = (...messages: unknown[]) => void;

/**
 * Namespaced logger object, returned by `useLogger`
 *
 * It contains all the functions to log a message based on its severity
 */
export interface NsLogger {
  /**
   * Logs errors affecting the operation/service
   */
  error: LogFunction;
  /**
   * Logs recuperable errors involving unexpected things
   */
  warn: LogFunction;
  /**
   * Log processes taking place (start, stop, etc.).
   * Useful to follow the app workflow
   */
  info: LogFunction;
  /**
   * Log detailed info, not important messages
   */
  verbose: LogFunction;
  /**
   * Log debug messages
   */
  debug: LogFunction;
}

/**
 * Hook to retrieve the a logger namespace from the deepest provided
 * `<Logger>` instance.
 * There will always be at least one instance created automatically from
 * `logger.config.js` options at the top `<App>` component so usually there's
 * no need to create more `<Logger>` providers.
 *
 * Each page receives already a `logger` property initialized to its own
 * namespace, but each component can have its own as needed
 * (recommended to get different namespaces to make logs more readable)
 */
export function useLogger(namespace: string): NsLogger {
  const logger = useContext(Logger);
  return logger!.getLogger(namespace);
}

/**
 * This works the same way as useLogger, but can be called outside React because
 * it's not using hooks.
 * It will always return a logger with the global logger configuration from
 * `logger.config.js`
 */
export function getLogger(namespace: string): NsLogger {
  return globalLogger.getLogger(namespace);
}
