import { LoggerService } from '@nestjs/common';

/**
 * @description
 * 日志级别枚举
 *
 * @docsCategory Logger
 */
export enum LogLevel {
  /**
   * @description
   * Log Errors only.
   */
  Error = 0,
  Warn = 1,
  Info = 2,
  Verbose = 3,
  Debug = 4,
}

/**
 * @description
 * PickerLogger 接口定义了 logger service 接口
 *
 * @docsCategory Logger
 */
export interface PickerLogger {
  error(message: string, context?: string, trace?: string): void;
  warn(message: string, context?: string): void;
  info(message: string, context?: string): void;
  verbose(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}

const noopLogger: PickerLogger = {
  error() { /* */ },
  warn() { /* */ },
  info() { /* */ },
  verbose() { /* */ },
  debug() { /* */ },
};

/**
 * @description
 *
 * @docsCategory Logger
 */
export class Logger implements LoggerService {
  private static _instance: typeof Logger = Logger;
  private static _logger: PickerLogger;

  static get logger(): PickerLogger {
    return this._logger || noopLogger;
  }

  private get instance(): typeof Logger {
    const { _instance } = Logger;
    return _instance;
  }

  /** @internal */
  static useLogger(logger: PickerLogger) {
    Logger._logger = logger;
  }

  /** @internal */
  error(message: any, trace?: string, context?: string): any {
    this.instance.error(message, context, trace);
  }

  /** @internal */
  warn(message: any, context?: string): any {
    this.instance.warn(message, context);
  }

  /** @internal */
  log(message: any, context?: string): any {
    this.instance.info(message, context);
  }

  /** @internal */
  verbose(message: any, context?: string): any {
    this.instance.verbose(message, context);
  }

  /** @internal */
  debug(message: any, context?: string): any {
    this.instance.debug(message, context);
  }

  static error(message: string, context?: string, trace?: string): void {
    Logger.logger.error(message, context, trace);
  }

  static warn(message: string, context?: string): void {
    Logger.logger.warn(message, context);
  }

  static info(message: string, context?: string): void {
    Logger.logger.info(message, context);
  }

  static verbose(message: string, context?: string): void {
    Logger.logger.verbose(message, context);
  }

  static debug(message: string, context?: string): void {
    Logger.logger.debug(message, context);
  }
}
