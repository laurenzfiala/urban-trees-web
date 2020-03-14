import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import {Log} from '../../services/log.service';
import {AuthService} from '../../../shared/services/auth.service';
import {Observable} from 'rxjs/observable';
import {LoginAccessReason} from './logout-reason.enum';

/**
 * Guard to check valid authentication before accessing
 * secured resources.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
@Injectable()
export class ProjectLoginGuard implements CanActivate, CanActivateChild {

  private static LOG: Log = Log.newInstance(ProjectLoginGuard);

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
   * @returns {boolean} true if the route may be accessed; false otherwise
   */
  private canActivateRoute(route: ActivatedRouteSnapshot, state: RouterStateSnapshot, redirect: boolean = true): UrlTree | boolean {

    if (this.isAllowedToActivateRoute(route)) {
      return true;
    }
    let loginAccessReason;
    if (this.authService.isLoggedIn()) {
      loginAccessReason = LoginAccessReason.INSUFFICIENT_PERMISSIONS;
    }

    let queryParamsVal = {'reason': loginAccessReason || this.authService.getLogOutReason()};
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

  /**
   * Check whether the user is logged in and has access to the given route.
   * @param route target route to check
   * @returns true if the user may access the route; false otherwise
   */
  public isAllowedToActivateRoute(route: ActivatedRouteSnapshot): boolean {

    const isLoggedIn = this.authService.isLoggedIn();
    const isAccessGranted = this.isRoleAccessGranted(route);

    return isLoggedIn && isAccessGranted;

  }

  /**
   * Checks the roles of the currently logged in user
   * and whether they are allowed to access the protected
   * resource being accessed.
   * @param route The route to access.
   * @see AuthService#isUserRoleAccessGranted
   */
  private isRoleAccessGranted(route: ActivatedRouteSnapshot): boolean {

    if (!route.data || Object.keys(route.data).length === 0) {
      return true;
    }

    return this.authService.isUserRoleAccessGranted(route.data.roles);

  }

}
