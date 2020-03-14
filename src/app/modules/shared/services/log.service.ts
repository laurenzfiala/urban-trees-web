import {Type} from '@angular/core';
import * as moment from 'moment';
import {environment} from '../../../../environments/environment';
import {LogLevel} from '../../trees/entities/log-level.entity';

/**
 * Logging class to be created by all components
 * that log into the console.
 *
 * @author Laurenz Fiala
 * @since 2018/02/15
 */
export class Log {

  /**
   * Format to use when prepending the log messages.
   */
  private static DATE_FORMAT = 'HH:mm:ss.SSS';

  /**
   * The type name for this logger.
   */
  private typeName: string;

  private constructor(typeName: string) {
    this.typeName = typeName;
  }

  /**
   * Creates a new logger instance for the given type.
   * @param {Type<any>} type
   * @returns {Log}
   */
  public static newInstance(type: Type<any>): Log {
    return new Log(type.name);
  }

  /**
   * Returns a date string formatted using Log#DATE_FORMAT for the current time.
   */
  private static shortTimeNow(): string {
    return moment().format(Log.DATE_FORMAT);
  }

  /**
   * Prepend the standard logging information before every message line in the console.
   * @param {LogLevel} level log level to display
   * @param outputs the messages to write to the console.
   * @returns {string} concatenated result.
   */
  private prepend(level: LogLevel, ...outputs: any[]): string {

    let result = '[' + LogLevel[level] + '] ' + Log.shortTimeNow() + ' ' + this.typeName + ' - ';
    for (let o of outputs) {
      result += o;
    }
    return result;

  }

  /**
   * Log to the console.
   * @param {LogLevel} level The LogLevel to use
   * @param {string} message Message to display
   * @param logObject (optional) object to display
   */
  private log(level: LogLevel, message: string, logObject?: any) {

    if (environment.log.level > level) {
      return;
    }

    message = this.prepend(level, message);

    switch (level) {

      case LogLevel.TRACE:
      case LogLevel.DEBUG:
      case LogLevel.INFO:
        console.log(message);
        if (logObject) {
          console.log(logObject);
        }
        break;

      case LogLevel.WARN:
        console.warn(message);
        if (logObject) {
          console.warn(logObject);
        }
        break;

      case LogLevel.ERROR:
        console.error(message);
        if (logObject) {
          console.error(logObject);
        }
        break;

    }

  }

  /**
   * Log with LogLevel#TRACE level.
   * @param {string} message Message to log to the console.
   * @param logObject (optional) object to log to the console.
   */
  public trace(message: string, logObject?: any) {
    return this.log(LogLevel.TRACE, message, logObject);
  }

  /**
   * Log with LogLevel#DEBUG level.
   * @param {string} message Message to log to the console.
   * @param logObject (optional) object to log to the console.
   */
  public debug(message: string, logObject?: any) {
    return this.log(LogLevel.DEBUG, message, logObject);
  }

  /**
   * Log with LogLevel#INFO level.
   * @param {string} message Message to log to the console.
   * @param logObject (optional) object to log to the console.
   */
  public info(message: string, logObject?: any) {
    return this.log(LogLevel.INFO, message, logObject);
  }

  /**
   * Log with LogLevel#WARN level.
   * @param {string} message Message to log to the console.
   * @param logObject (optional) object to log to the console.
   */
  public warn(message: string, logObject?: any) {
    return this.log(LogLevel.WARN, message, logObject);
  }

  /**
   * Log with LogLevel#ERROR level.
   * @param {string} message Message to log to the console.
   * @param logObject (optional) object to log to the console.
   */
  public error(message: string, logObject?: any) {
    return this.log(LogLevel.ERROR, message, logObject);
  }

}
