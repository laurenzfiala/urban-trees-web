import {HttpHeaders} from '@angular/common/http';

/**
 * Abstract service class containing common helpers and logic.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export abstract class AbstractService {

  /**
   * Key for the cookie and http header to set as
   * the api key to authenticate with the backend.
   */
  private static API_KEY_HEADER = 'x-api-key';

  /**
   * Default timout error to hand to subscribe#error closure.
   * @type {Error} error with generic message
   */
  protected defaultTimeoutErr = new Error('Exceeded subscription timeout');

  /**
   * Returns the HttpHeaders needed for authenticating with the backend.
   * @returns {HttpHeaders}
   */
  protected getAuthHeaders(): HttpHeaders {

    let apiKey = this.getCookie(AbstractService.API_KEY_HEADER);

    return new HttpHeaders()
      .set(AbstractService.API_KEY_HEADER, apiKey);

  }

  /**
   * Get a single cookie by name.
   * @param {string} name cookie name
   * @returns {string} the cookie value or null if not found
   */
  private getCookie(name: string): string {
    let value = '; ' + document.cookie;
    let parts = value.split('; ' + name + '=');
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

}
