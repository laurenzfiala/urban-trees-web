import {HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {ApiError} from '../entities/api-error.entity';

/**
 * Abstract service class containing common helpers and logic.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export abstract class AbstractService {

  /**
   * Default timout error to hand to subscribe#error closure.
   * @type {Error} error with generic message
   */
  protected defaultTimeoutErr = new Error('Exceeded subscription timeout');

  /**
   * Returns an ApiError if possible, otherwise null.
   * @param {HttpErrorResponse} o Error object given back by e.g. HttpClient observable.
   * @returns {ApiError} ApiError if available; null otherwise.
   */
  protected safeApiError(o: HttpErrorResponse): ApiError {
    if (!o) {
      return null;
    }
    let apiErr = ApiError.fromObject(o.error);
    if (apiErr) {
      return apiErr.withStatusCode(o.status);
    }
    return null;
  }

  /**
   * Get a single cookie by name.
   * @param {string} name cookie name
   * @returns {string} the cookie value or null if not found
   */
  protected getCookie(name: string): string {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

}
