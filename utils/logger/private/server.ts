/*
 * Server side implementation of the Logger interface
 */
import { createLogger, transports, format, Logger as Winston } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';
import { grey } from 'chalk';
import { NsLogger, LoggerOptions, LoggerLevel } from '..';

interface MessageData extends TransformableInfo {
  level: LoggerLevel;
  timestamp: string;
  namespace: string;
}

// interface from `logform` package, used by winston
interface TransformableInfo {
  level: string;
  message: string;
  [key: string]: any; // tslint:disable-line: no-any
}

// interface from `logform` package, used by winston
interface Format {
  transform: (data: TransformableInfo) => TransformableInfo | boolean;
}

const bypass = (x: unknown) => x;

export class ServerLogger {
  private readonly nsLoggers: { [namespace: string]: NsLogger } = {};
  private readonly winston: Winston;
  private readonly formatNamespace: (text: string) => string;

  constructor(options?: LoggerOptions) {
    const opt: Required<LoggerOptions> = {
      level: IS_PRODUCTION ? 'error' : 'debug',
      silent: false,
      console: !(IS_PRODUCTION || IS_TEST),
      disableColors: false,
      addTimestamp: true,
      outputFolder: 'logs',
      outputFile: '%DATE%.log',
      maxFiles: 30,
      ...options,
    };

    this.formatNamespace = (opt.disableColors ? bypass : grey) as (
      text: string
    ) => string;

    this.winston = createLogger({
      silent: opt.silent,
      level: opt.level,
      transports: ServerLogger.getTransports(opt),
      format: this.getFormats(opt),
    });
  }

  private static getTransports(options: Required<LoggerOptions>) {
    const winstonTransports = [];

    if (options.console) {
      winstonTransports.push(new transports.Console());
    }

    if (options.outputFile) {
      winstonTransports.push(
        new DailyRotateFile({
          dirname: options.outputFolder,
          filename: options.outputFile,
          maxFiles: options.maxFiles,
          auditFile: join(
            options.outputFolder,
            'audit',
            `.audit-${new Date().toISOString()}`
          ),
        })
      );
    }

    return winstonTransports;
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
    const message = msgs
      .map((m) => (typeof m === 'object' ? JSON.stringify(m) : m))
      .join(' ');
    this.winston.log({ message, level, namespace });
  }

  private getFormats(options: Required<LoggerOptions>): Format {
    const customFormat = format.printf((data) => {
      const { level, message, timestamp, namespace } = data as MessageData;
      const time = timestamp ? `${timestamp} ` : '';
      const ns = this.formatNamespace(namespace);

      return `${time}[${level} | ${ns}] ${message}`;
    });

    const formats: Format[] = [];
    if (options.disableColors) formats.push(format.colorize());
    if (options.addTimestamp) formats.push(format.timestamp());
    formats.push(customFormat);

    return format.combine(...formats);
  }
}
