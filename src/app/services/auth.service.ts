import { Injectable } from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from './environment.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {Login} from '../entities/login.entity';
import {ApiError} from '../entities/api-error.entity';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {LogoutReason} from '../components/project-login/logout-reason.enum';
import {LoginStatus} from '../components/project-login/login-status.enum';

/**
 * Service for user authentication functionality.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
@Injectable()
export class AuthService extends AbstractService {

  private static LOG: Log = Log.newInstance(AuthService);

  public static LOCAL_STORAGE_AUTH_KEY: string = 'jwt_access_token';

  /**
   * Key for the cookie and http header to set as
   * the api key to authenticate with the backend.
   */
  public static HEADER_API_KEY = 'x-api-key';

  public static HEADER_AUTH_KEY: string = 'Authorization';

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient,
              private router: Router,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Send login request to the backend and react on the response.
   * This includes saving the given authorization header to the local storage.
   * @param {Login} loginEntity username, password
   * @param {() => void} successCallback called when login was successful
   * @param {(error: HttpErrorResponse, apiError?: ApiError) => void} errorCallback when login failed
   */
  public login(loginEntity: Login,
               successCallback: () => void,
               errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.post(this.envService.endpoints.login, loginEntity, {observe: 'response'})
      .subscribe((response: HttpResponse<any>) => {
        this.setJWTToken(response.headers.get(AuthService.HEADER_AUTH_KEY));
        AuthService.LOG.debug('Saved retrieved auth token to local storage.');
        successCallback();
      }, (e: any) => {
        AuthService.LOG.error('Could not log in: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Delete JWT token from local storage.
   * @see AuthService#deleteJWTToken
   */
  public logout(): void {
    this.deleteJWTToken();
  }

  /**
   * Whether the user is currently logged in.
   * @returns {boolean} true if the user is logged in; false otherwise.
   * @see AuthService#getLoggedInStatus
   */
  public isLoggedIn(): boolean {
    return this.getLogInStatus() !== LoginStatus.NOT_AUTHENTICATED;
  }

  /**
   * Check the users' login status.
   * @returns {LoginStatus} if logged in and using which method
   */
  public getLogInStatus(): LoginStatus {

    const token = AuthService.getJWTToken();
    const apiKey = this.getApiKey();

    if (apiKey) {
      return LoginStatus.LOGGED_IN_API_KEY;
    }

    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return LoginStatus.LOGGED_IN_JWT;
    }

    return LoginStatus.NOT_AUTHENTICATED;

  }

  /**
   * Checks what reason should be displayed to
   * the user when logging out.
   * @returns {boolean} null if the user is in any way authenticated (see #getLogInStatus); the logout reason otherwise.
   */
  public getLogOutReason(): LogoutReason {

    const logInStatus = this.getLogInStatus();
    if (logInStatus) {
      return null;
    }

    const token = AuthService.getJWTToken();
    const apiKey = this.getApiKey();

    if (apiKey) {
      return null;
    }

    if (!token) {
      return LogoutReason.NOT_AUTHENTICATED;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      return LogoutReason.FORCE_LOGOUT_EXPIRED;
    }

    return null;

  }

  /**
   * Redirect the user to the login page.
   * This is called from the http interceptor and the login guard.
   * @param {LogoutReason} accessReason reason of redirect
   * @param {redirectTo} (optional) specify where to redirect to after successful login
   */
  public redirectToLogin(accessReason: LogoutReason, redirectTo?: string): void {

    this.router.navigate(
      ['/login'],
      {
        queryParams: {'redirect': redirectTo ? redirectTo : this.router.url, 'reason': accessReason},
        queryParamsHandling: 'merge'
      }
    );

  }

  /**
   * Set JWT token to local storage.
   * @param {string} token token to set
   */
  private setJWTToken(token: string): void {
    localStorage.setItem(AuthService.LOCAL_STORAGE_AUTH_KEY, token);
  }

  /**
   * Remove JWT token from local storage.
   */
  private deleteJWTToken(): void {
    localStorage.removeItem(AuthService.LOCAL_STORAGE_AUTH_KEY);
  }

  /**
   * TODO
   * @returns {string}
   */
  public getApiKey(): string {
    return this.getCookie(AuthService.HEADER_API_KEY);
  }

  /**
   * TODO
   * @returns {string}
   */
  public static getJWTToken(): string {
    const storedToken = localStorage.getItem(AuthService.LOCAL_STORAGE_AUTH_KEY);
    if (!storedToken || storedToken === 'null') {
      return undefined;
    }
    return storedToken;
  }

}
