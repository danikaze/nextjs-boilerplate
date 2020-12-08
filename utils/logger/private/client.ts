/*
 * Client side implementation of the Logger interface
 */
import { NsLogger, LoggerOptions, LoggerLevel } from '..';

const levelPriorities = {
  error: 0,
  warn: 1,
  info: 2,
  verbose: 3,
  debug: 4,
};

const levelMethods: { [level in LoggerLevel]: keyof Console } = {
  error: 'error',
  warn: 'warn',
  info: 'log',
  verbose: 'info',
  debug: 'info',
};

type ClientLoggerOptions = Omit<
  LoggerOptions,
  'outputFolder' | 'outputFile' | 'maxFiles'
>;

const noColors = [undefined, undefined, undefined, undefined];
const noColorsMap = {
  error: noColors,
  warn: noColors,
  info: noColors,
  verbose: noColors,
  debug: noColors,
};
const colorsMap = {
  error: noColors,
  warn: noColors,
  info: ['color: #0dbc79', undefined, 'color: grey', undefined],
  verbose: ['color: #199bcd', undefined, 'color: grey', undefined],
  debug: ['color: #1f57c8', undefined, 'color: grey', undefined],
};

export class ClientLogger {
  private readonly silent: boolean;
  private readonly level: LoggerLevel;
  private readonly colors: { [level in LoggerLevel]: (string | undefined)[] };
  private readonly addTimestamp: boolean;
  private readonly nsLoggers: { [namespace: string]: NsLogger } = {};

  constructor(options?: ClientLoggerOptions) {
    const opt: Required<ClientLoggerOptions> = {
      level: (IS_PRODUCTION ? 'error' : 'debug') as LoggerLevel,
      silent: false,
      console: !(IS_PRODUCTION || IS_TEST),
      disableColors: false,
      addTimestamp: true,
      ...options,
    };
    this.silent = opt.silent || !opt.console;
    this.level = opt.level;
    this.addTimestamp = opt.addTimestamp;
    this.colors = opt.disableColors ? noColorsMap : colorsMap;
  }

  public getLogger(namespace: string): NsLogger {
    let nsl = this.nsLoggers[namespace];
    if (nsl) {
      return nsl;
    }

    const log = this.log;
    nsl = {
      error: log.bind(this, 'error', namespace),
      warn: log.bind(this, 'warn', namespace),
      info: log.bind(this, 'info', namespace),
      verbose: log.bind(this, 'verbose', namespace),
      debug: log.bind(this, 'debug', namespace),
    };
    this.nsLoggers[namespace] = nsl;

    return nsl;
  }

  private log(level: LoggerLevel, namespace: string, ...msgs: unknown[]): void {
    if (
      !console ||
      this.silent ||
      levelPriorities[this.level] < levelPriorities[level]
    ) {
      return;
    }

    const method = levelMethods[level];
    const time = this.addTimestamp ? `${new Date().toISOString()} ` : '';
    console[method](
      `${time}[%c${level}%c | %c${namespace}%c]`,
      ...this.colors[level],
      ...msgs
    );
  }
}
