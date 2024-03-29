
import {map} from 'rxjs/operators';
import {Inject, Injectable, NgZone} from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from './environment.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {ApiError} from '../entities/api-error.entity';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {LoginAccessReason} from '../../trees/components/project-login/logout-reason.enum';
import {LoginStatus} from '../../trees/components/project-login/login-status.enum';
import {JWTToken} from '../../trees/entities/jwt-token.entity';
import {PasswordReset} from '../../trees/entities/password-reset.entity';
import {Observable, Subject} from 'rxjs';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {UserPermissionRequest} from '../../trees/entities/user-permission-request.entity';
import {AuthenticationToken} from '../../trees/entities/auth-token.entity';
import {DOCUMENT} from '@angular/common';

/**
 * Service for user authentication functionality.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
@Injectable()
export class AuthService extends AbstractService {

  private static LOG: Log = Log.newInstance(AuthService);

  public static COOKIE_JWTTOKEN_KEY: string = 'jwt_access_token';
  public static LOCAL_STORAGE_APIKEY_KEY: string = 'api_key';

  /**
   * Key for the localStorage and http header to set as
   * the api key to authenticate with the backend.
   */
  public static HEADER_API_KEY = 'x-api-key';

  public static HEADER_AUTH_KEY: string = 'Authorization';

  private jwtHelper: JwtHelperService = new JwtHelperService();

  /**
   * Emits when the authentication state changes.
   */
  public stateChangedSubject: Subject<LoginStatus> = new Subject<LoginStatus>();

  /**
   * Cached permissions PIN is stored here.
   * When #loadPPIN is called and returns successfully,
   * this holds the current users' PPIN.
   * This is deleted as soon as the user logs out.
   */
  private ppin: string;

  constructor(private http: HttpClient,
              private router: Router,
              private envService: EnvironmentService,
              private zone: NgZone,
              @Inject(DOCUMENT) private document: Document) {
    super();

    // make auth tokens accessible to the app
    window['getJWTToken'] = () => this.getJWTTokenRaw();
    window['refreshLogin'] = () => this.zone.run(args => this.stateChanged());
  }

  /**
   * Return the users' roles if they are logged in,
   * null otherwise or if no roles can be found.
   * - 2018/12/17: apiKey present now grants access to phenobs roles.
   *               Please note that apiKey authorization is not checked client-side unlike JWT auth.
   *               Therefore unauthorized users may access some pages, but they can't execute any server-side
   *               functions.
   *               TODO add backend lookup to validate apiKey
   * @param ignoreExpired (default false) true to get token even if it is expired
   * @returns {Array<String>} List of the current users' roles.
   */
  public getUserRoles(ignoreExpired: boolean = false): Array<string> {

    const token: JWTToken = this.getJWTToken(ignoreExpired);
    const apiKey = AuthService.getApiKeyRaw();

    if (!token) {
      if (apiKey) {
        return this.envService.security.rolesPhenObs;
      }
      return null;
    }

    return token.getRoles();

  }

  /**
   * Returns the logged in users' username.
   * Also returns the username for expired JWT token.
   * If the user is not logged in or login is anonymous (=> not JWT),
   * return undefined.
   */
  public getUsername(): string {

    const tokenRaw = this.getJWTTokenRaw();
    if (tokenRaw) {
      return JWTToken.fromObject(this.jwtHelper.decodeToken(tokenRaw)).sub;
    }
    return undefined;

  }

  /**
   * Returns the logged in users' unique ID.
   * If the user is not logged in or login is anonymous (=> not JWT),
   * return undefined.
   */
  public getUserId(): number {
    let token = this.getJWTToken();
    if (!token) {
      return undefined;
    }
    return token.uid;
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
   * @param ignoreExpired (default false) true to get token even if it is expired
   */
  public isUserRoleAccessGranted(grantRoles: String[], ignoreExpired: boolean = false): boolean {

    const userRoles = this.getUserRoles(ignoreExpired);

    if (!userRoles) {
      return false;
    }

    if (!grantRoles) {
      return true;
    }

    return userRoles.some(userRole => {
      // double-equals is intentional here for comparing two separate entities
      // tslint:disable-next-line:triple-equals
      return grantRoles.findIndex(e => e == userRole) !== -1;
    });

  }

  /**
   * Send login request to the backend and react on the response.
   * This includes saving the given authorization header to the local storage.
   * @param {AuthenticationToken} authToken any valid authentication token
   * @param {() => void} successCallback called when login was successful
   * @param {(error: HttpErrorResponse, apiError?: ApiError) => void} errorCallback when login failed
   */
  public login(authToken: AuthenticationToken,
               successCallback: () => void,
               errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.post(this.envService.endpoints.login, authToken, {observe: 'response', withCredentials: true})
      .subscribe(() => {
        AuthService.LOG.debug('Logged in successfully.');
        this.stateChanged();
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
   * Send change username request to backend.
   * @param {string} newUsername username to change to
   * @param {() => void} successCallback called upon successful username change
   * @param {(error: HttpErrorResponse, apiError?: ApiError) => void} errorCallback calle upon error
   */
  public changeUsername(newUsername: string,
               successCallback: () => void,
               errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.changeUsername, {'username': newUsername})
      .subscribe((response: HttpResponse<any>) => {
        AuthService.LOG.debug('Changed password successfully.');
        this.logout();
        successCallback();
      }, (e: any) => {
        AuthService.LOG.error('Could not change password: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all users that have granted the current user the given permission.
   * @param permission permission to check
   * @param successCallback called with results when successful
   * @param errorCallback called with error if failed
   */
  public loadUsersGrantingPermission(permission: string,
                                     successCallback: (grantingUsers: Set<UserIdentity>) => void,
                                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    AuthService.LOG.debug('Loading granting users for permission ' + permission + '...');
    this.http.get<Array<UserIdentity>>(this.envService.endpoints.usersGrantingPermission(permission)).pipe(
      map(list => list && list.map(u => UserIdentity.fromObject(u))))
      .subscribe((grantingUsers: Array<UserIdentity>) => {
        AuthService.LOG.debug('Loaded granting users successfully.');
        successCallback(new Set<UserIdentity>(grantingUsers));
      }, (e: any) => {
        AuthService.LOG.error('Could not load granting users: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all users that have granted the current user the given permission. TODO
   * @param permission permission to check
   * @param successCallback called with results when successful
   * @param errorCallback called with error if failed
   */
  public addUserPermission(permission: string,
                           username: string,
                           password: string,
                           successCallback: (result: UserIdentity) => void,
                           errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    AuthService.LOG.debug('Requesting permission ' + permission + ' from ' + username + '...');

    const payload = new UserPermissionRequest(
      username,
      password,
      permission
    );

    this.http.post<UserIdentity>(this.envService.endpoints.addUserPermission, payload).pipe(
      map(u => u && UserIdentity.fromObject(u)))
      .subscribe((result: UserIdentity) => {
        AuthService.LOG.debug('Requested permission ' + permission + ' successfully.');
        successCallback(result);
      }, (e: any) => {
        AuthService.LOG.error('Could not request permission: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load the users' current permissions PIN (PPIN).
   * @param successCallback called with result when successful
   * @param errorCallback called with error if failed
   */
  public loadPPIN(successCallback: (ppin: string) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    AuthService.LOG.debug('Loading PPIN...');
    this.http.get(this.envService.endpoints.loadPPIN, {responseType: 'text'})
      .subscribe((ppin: string) => {
        this.ppin = ppin;
        AuthService.LOG.debug('Loaded PPIN successfully.');
        successCallback(ppin);
      }, (e: any) => {
        AuthService.LOG.error('Could not load granting users: ' + e.message, e);
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
    this.ppin = undefined;
    this.deleteJWTToken();
    this.stateChanged();
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
   * Note: Also deletes the authentication token if it has become invalid.
   * @param ignoreExpired (default false) true to get token even if it is expired
   * @returns {LoginStatus} if logged in and using which method
   */
  public getLogInStatus(ignoreExpired: boolean = false): LoginStatus {

    const token: JWTToken = this.getJWTToken(ignoreExpired);
    const apiKey = AuthService.getApiKeyRaw();

    if (token) {
      return LoginStatus.LOGGED_IN_JWT;
    }

    if (apiKey) {
      return LoginStatus.LOGGED_IN_API_KEY;
    }

    return LoginStatus.NOT_AUTHENTICATED;

  }

  /**
   * Checks what reason should be displayed to
   * the user when logging out.
   * @param backendForcedLogout whether the backend returned 403 (true) or not (false)
   * @returns {boolean} null if the user is in any way authenticated (see #getLogInStatus); the logout reason otherwise.
   */
  public getLogOutReason(backendForcedLogout: boolean = false): LoginAccessReason {

    const token = this.getJWTTokenRaw();
    const isLoginLinkLogin = this.isUserRoleAccessGranted([this.envService.security.roleTempLoginLink], true);
    this.logout();

    if (!token) {
      return LoginAccessReason.NOT_AUTHENTICATED;
    }

    if (this.jwtHelper.isTokenExpired(token)) {
      if (isLoginLinkLogin) {
        return LoginAccessReason.FORCE_LOGOUT_EXPIRED_LOGIN_LINK;
      }
      return LoginAccessReason.FORCE_LOGOUT_EXPIRED;
    } else if (this.isAdmin() && backendForcedLogout) {
      return LoginAccessReason.FORCE_CREDENTIALS_CONFIRM;
    } else if (backendForcedLogout) {
      return LoginAccessReason.FORCE_LOGOUT;
    }

    return null;

  }

  /**
   * Whether the logged in user is an admin or not.
   */
  public isAdmin(): boolean {
    return this.isUserRoleAccessGranted(this.envService.security.rolesAdmin);
  }

  /**
   * Whether the logged in user is anonymous or not.
   * Also returns true if the user is not logged in at all.
   */
  public isUserAnonymous(): boolean {
    return this.getLogInStatus() !== LoginStatus.LOGGED_IN_JWT;
  }

  /**
   * Return true if the current user has the
   * temporary change password role.
   */
  public isTempChangePasswordAuth(): boolean {
    let roles = this.getUserRoles();
    return roles && roles.indexOf(this.envService.security.roleTempChangePassword) !== -1;
  }

  /**
   * Return true if the current user has the
   * temporary no password role.
   */
  public isTempNoPasswordAuth(): boolean {
    let roles = this.getUserRoles();
    return roles && roles.indexOf(this.envService.security.roleTempNoPassword) !== -1;
  }

  /**
   * Return true if the current user has the
   * temporary role for OTP activation.
   */
  public isTempActivateOTP(): boolean {
    let roles = this.getUserRoles();
    return roles && roles.indexOf(this.envService.security.roleTempActivateOTP) !== -1;
  }

  /**
   * Returns the application-relative path to which
   * the user should be redirected after login.
   * If a temporary role is assigned to the user, we
   * want them to be redirected to e.g. the password change page.
   * @param redirectTo this is the low-precedence path used if
   *                   no special conditions are met.
   *                   (e.g. the path the user was previously on)
   * @returns application-relative path (e.g. /account/changepassword)
   */
  public getRedirectAfterLogin(redirectTo: string): string {

    if (this.isTempChangePasswordAuth()) {
      redirectTo = '/account/changepassword';
    } else if (this.isTempActivateOTP()) {
      redirectTo = '/account/2fa';
    }

    return redirectTo;

  }

  /**
   * Redirect the user to the login page.
   * This is called from the http interceptor and the login guard.
   * @param {LoginAccessReason} accessReason reason of redirect
   * @param {redirectTo} (optional) specify where to redirect to after successful login
   */
  public redirectToLogin(accessReason: LoginAccessReason, redirectTo?: string): void {

    this.router.navigate(
      ['/login'],
      {
        queryParams: {'redirect': redirectTo ? redirectTo : this.router.url, 'reason': accessReason},
        queryParamsHandling: 'merge'
      }
    );

  }

  /**
   * Remove JWT token cookie.
   */
  private deleteJWTToken(): void {
    let cookies = this.document.cookie.split('; ');
    const tokenCookieIndex = cookies.findIndex(c => c.startsWith(AuthService.COOKIE_JWTTOKEN_KEY + '='));
    cookies.splice(tokenCookieIndex, 1);
    cookies.push(AuthService.COOKIE_JWTTOKEN_KEY + '=;Path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT');
    this.document.cookie = cookies.join('; ');
  }

  /**
   * Returns the decoded JWT token object.
   * If the JWT token is expired, return undefined.
   * @param ignoreExpired (default false) true to get token even if it is expired
   */
  public getJWTToken(ignoreExpired: boolean = false): JWTToken {
    const storedToken = this.getJWTTokenRaw();
    if (!storedToken) {
      return undefined;
    }

    const token: JWTToken = JWTToken.fromObject(this.jwtHelper.decodeToken(storedToken));
    if (!token || (this.jwtHelper.isTokenExpired(storedToken) && !ignoreExpired)) {
      return undefined;
    }
    return token;
  }

  /**
   * @see #ppin
   */
  public getPPIN() {
    return this.ppin;
  }

  /**
   * Emit an event to make subcribers aware
   * of authentication changes.
   */
  private stateChanged(): void {
    this.stateChangedSubject.next(this.getLogInStatus());
  }

  /**
   * Get the observable for authentication state
   * changes.
   */
  public onStateChanged(): Observable<LoginStatus> {
    return this.stateChangedSubject.asObservable();
  }

  /**
   * Whether the client is on a secure connection or not.
   */
  public isSslConnection(): boolean {
    return window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname.indexOf('192.168.') === 0;
  }

  /**
   * Returns the JWT token like stored in the cookie.
   * If not set, returns undefined.
   */
  public getJWTTokenRaw(): string {
    const cookie = this.document.cookie
      .split('; ')
      .find(row => row.startsWith(AuthService.COOKIE_JWTTOKEN_KEY + '='));
    if (cookie === undefined) {
      return undefined;
    }

    const token = cookie.split('=')[1];
    if (!token || token === 'null') {
      return undefined;
    }
    return token;
  }

  /**
   * Returns the API key like stored in localStorage.
   * If not set, returns undefined.
   */
  public static getApiKeyRaw(): string {
    const storedToken = localStorage.getItem(AuthService.LOCAL_STORAGE_APIKEY_KEY);
    if (!storedToken || storedToken === 'null') {
      return undefined;
    }
    return storedToken;
  }

}
