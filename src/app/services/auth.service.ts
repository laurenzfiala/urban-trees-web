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
import {JWTToken} from '../entities/jwt-token.entity';
import {PasswordReset} from '../entities/password-reset.entity';

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
   * Return the users' roles if they are logged in,
   * null otherwise or if no roles can be found.
   * - 2018/12/17: apiKey present now grants access to phenobs roles.
   *               Please note that apiKey authorization is not checked client-side unline JWT auth.
   *               Therefore unauthorizes users may access some pages, but they can't execute any server-side
   *               functions.
   *               TODO add backend lookup to validate apiKey
   * @returns {Array<String>} List of the current users' roles.
   */
  public getUserRoles(): Array<string> {

    const token = AuthService.getJWTTokenRaw();
    const apiKey = this.getApiKey();

    if (!token) {
      if (apiKey) {
        return this.envService.security.rolesPhenObs;
      }
      return null;
    }

    const tokenPayload = JWTToken.fromObject(this.jwtHelper.decodeToken(token));
    return tokenPayload.getRoles();

  }

  /**
   * Whether or not the current user is allowed
   * for the given grantRoles.
   * - If at least one role in grantRoles can also be
   *   found in userRoles, return true (grant access).
   * - If grantRoles is undefined, return true (grant access).
   * - If grantRoles is empty, return false (deny access).
   * - Else, return false (deny access).
   * @param grantRoles Roles to grant access to (any match).
   */
  public isUserRoleAccessGranted(grantRoles: String[]): boolean {

    const userRoles = this.getUserRoles();

    if (!userRoles) {
      return false;
    }

    if (!grantRoles) {
      return true;
    }

    return userRoles.some(userRole => {
      // double-equals is intentional here for comparing two separate entities
      return grantRoles.findIndex(e => e == userRole) !== -1;
    });

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
   * Send change password request to backend.
   * @param {PasswordReset} changePassword old and new password
   * @param {() => void} successCallback called upon successful password change
   * @param {(error: HttpErrorResponse, apiError?: ApiError) => void} errorCallback calle upon error
   */
  public changePassword(changePassword: PasswordReset,
               successCallback: () => void,
               errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.changePassword, changePassword)
      .subscribe((response: HttpResponse<any>) => {
        AuthService.LOG.debug('Changed password successfully.');
        successCallback();
      }, (e: any) => {
        AuthService.LOG.error('Could not change password: ' + e.message, e);
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

    const token = AuthService.getJWTTokenRaw();
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

    const token = AuthService.getJWTTokenRaw();
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
   * Returns the decoded JWT token object.
   */
  public getJWTToken(): JWTToken {
    const storedToken = AuthService.getJWTTokenRaw();
    if (!storedToken) {
      return undefined;
    }
    return JWTToken.fromObject(this.jwtHelper.decodeToken(storedToken));
  }

  /**
   * Returns the JWT token like stored in localStorage.
   * If not set, returns undefined.
   */
  public static getJWTTokenRaw(): string {
    const storedToken = localStorage.getItem(AuthService.LOCAL_STORAGE_AUTH_KEY);
    if (!storedToken || storedToken === 'null') {
      return undefined;
    }
    return storedToken;
  }

  /**
   * Returns the API key from the cookies.
   * If not set, returns undefined.
   */
  public getApiKey(): string {
    return this.getCookie(AuthService.HEADER_API_KEY);
  }

}
