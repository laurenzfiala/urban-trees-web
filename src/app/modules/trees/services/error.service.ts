import { Injectable } from '@angular/core';

/**
 * This service is used to detect, log
 * and provide display data for the components on errors
 * that happened during the app execution.
 *
 * @author Laurenz Fiala
 * @since 2018/04/25
 */
@Injectable()
export class ErrorService {

  constructor() { }

}

/**
 * Origin error component (which
 * means module in the whole application flow).
 */
export enum ErrorComponent {
  DATABASE    = 'D',
  API         = 'A',
  WEBAPP      = 'W',
  ANDROID_APP = 'N'
}

/**
 * Error types give a hint to which
 * type of issue one if facing.
 * They should only be a single character.
 */
export enum ErrorType {

  /** Network related, like timeouts */
  NETWORK = 'N',

  /** Unspecified internal error */
  INTERNAL = 'I',

  /** Input data does not meet requirements */
  INPUT_INVALID = 'D',

  /** Resource can not be found */
  RESOURCE_MISSING = 'M',

  /** Resource can not be found */
  RESOURCE_INVALID = 'R'

}

/**
 *
 */
export enum ErrorCode {

  /** ABC */
  ABC = '001'

}
