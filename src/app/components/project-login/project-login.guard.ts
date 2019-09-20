import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot} from '@angular/router';
import {Log} from '../../services/log.service';
import {AuthService} from '../../services/auth.service';
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

  constructor(private authService: AuthService) {}

  /**
   * @see canActivateInternal
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return this.canActivateRoute(route);

  }

  /**
   * @see canActivateInternal
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.canActivateRoute(childRoute);

  }

  /**
   * Whether the client may access the requested page or
   * be redirected to the login page.
   * @param {ActivatedRouteSnapshot} route
   * @returns {boolean} true if the route may be accessed; false otherwise
   */
  public canActivateRoute(route: ActivatedRouteSnapshot, redirect: boolean = true): boolean {

    const isLoggedIn = this.authService.isLoggedIn();
    const isAccessGranted = this.isRoleAccessGranted(route);
    let unauthorized: LoginAccessReason;
    if (isLoggedIn) {
      if (isAccessGranted) {
        return true;
      }
      unauthorized = LoginAccessReason.INSUFFICIENT_PERMISSIONS;
    }

    if (redirect) {
      let redirectLocation = route.pathFromRoot.map(value => value.url.map(value1 => value1.path).join('/')).join('/');
      this.authService.redirectToLogin(unauthorized || this.authService.getLogOutReason(), redirectLocation);
    }

    return false;

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
