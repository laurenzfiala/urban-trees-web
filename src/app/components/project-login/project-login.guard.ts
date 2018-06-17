import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import {Log} from '../../services/log.service';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs/observable';

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

    return this.canActivateInternal(route, state);

  }

  /**
   * @see canActivateInternal
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    return this.canActivateInternal(childRoute, state);

  }

  /**
   * Whether the client may access the requested page or
   * be redirected to the login page.
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean} true if the route may be accessed; false otherwise
   */
  private canActivateInternal(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const logoutReason = this.authService.getLoggedInStatus();
    if (!logoutReason) {
      return true;
    }

    // TODO refactor with e.g. flatMap
    let redirectLocation = route.pathFromRoot.map(value => value.url.map(value1 => value1.path).join('/')).join('/');

    this.authService.redirectToLogin(logoutReason, redirectLocation);

    return false;

  }

}
