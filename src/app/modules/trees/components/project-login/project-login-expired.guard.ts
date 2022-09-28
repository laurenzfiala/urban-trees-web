import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Log} from '../../../shared/services/log.service';
import {AuthService} from '../../../shared/services/auth.service';
import {Observable} from 'rxjs/observable';
import {JwtHelperService} from '@auth0/angular-jwt';
import {LoginStatus} from './login-status.enum';

/**
 * Guard to check if user is logged in and the
 * auth token is not expired.
 *
 * @author Laurenz Fiala
 * @since 2022/09/27
 */
@Injectable()
export class ProjectLoginExpiredGuard implements CanActivate, CanActivateChild {

  private static LOG: Log = Log.newInstance(ProjectLoginExpiredGuard);

  private jwtHelper: JwtHelperService = new JwtHelperService();

  constructor(private authService: AuthService,
              private router: Router) {}

  /**
   * @see canActivateInternal
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivateRoute(route, state);

  }

  /**
   * @see canActivateInternal
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivateRoute(childRoute, state);

  }

  /**
   * Whether the client may access the requested page or
   * be redirected to the login page.
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @param redirect (default true) if true, adds redirect param to the login url
   * @returns {boolean} true if the route may be accessed; false otherwise
   */
  private canActivateRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, redirect: boolean = true): UrlTree | boolean {

    if (this.authService.getLogInStatus(true) !== LoginStatus.LOGGED_IN_JWT) {
      return;
    }
    const token = this.authService.getJWTTokenRaw();
    if (!this.jwtHelper.isTokenExpired(token)) {
      return;
    }

    let queryParamsVal = {'reason': this.authService.getLogOutReason()};
    if (redirect) {
      queryParamsVal['redirect'] = state.url;
    }

    return this.router.createUrlTree(
      ['/login'],
      {
        queryParams: queryParamsVal,
        queryParamsHandling: 'merge'
      }
    );

  }

}
