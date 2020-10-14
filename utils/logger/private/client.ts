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

const levelFormats: Partial<{ [level in LoggerLevel]: string }> = {
  info: 'color: #0dbc79',
  verbose: 'color: #199bcd',
  debug: 'color: #1f57c8',
};

type ClientLoggerOptions = Omit<
  LoggerOptions,
  'outputFolder' | 'outputFile' | 'maxFiles'
>;

export class ClientLogger {
  private readonly silent: boolean;
  private readonly level: LoggerLevel;
  private readonly colors: (string | undefined)[];
  private readonly nsLoggers: { [namespace: string]: NsLogger } = {};

  constructor(options?: ClientLoggerOptions) {
    const opt = {
      level: (IS_PRODUCTION ? 'error' : 'debug') as LoggerLevel,
      silent: false,
      console: true,
      disableColors: false,
      ...options,
    };
    this.silent = opt.silent || !opt.console;
    this.level = opt.level;
    this.colors = opt.disableColors
      ? [undefined, undefined, undefined, undefined]
      : [levelFormats[opt.level], undefined, 'color: grey', undefined];
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
    const time = new Date();
    console[method](
      `${time.toISOString()} [%c${level}%c | %c${namespace}%c]`,
      ...this.colors,
      ...msgs
    );
  }
}
