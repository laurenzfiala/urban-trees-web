import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import {Log} from '../../services/log.service';
import {AuthService} from '../../services/auth.service';
import {Observable} from 'rxjs/observable';
import {EnvironmentService} from '../../services/environment.service';

/**
 * Guard to check valid authentication before accessing
 * admin resources.
 *
 * @author Laurenz Fiala
 * @since 2019/02/17
 */
@Injectable()
export class AdminGuard implements CanActivate, CanActivateChild {

  private static LOG: Log = Log.newInstance(AdminGuard);

  constructor(private authService: AuthService,
              private envService: EnvironmentService) {}

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

    const isLoggedIn = this.authService.isLoggedIn();
    const isAccessGranted = this.authService.getJWTToken().exp * 1000 - this.envService.security.jwtTokenExpireMs + this.envService.security.adminTimeoutMs >= new Date().getTime();
    if (isLoggedIn && isAccessGranted) {
      return true;
    }

    let redirectLocation = route.pathFromRoot.map(value => value.url.map(value1 => value1.path).join('/')).join('/');
    this.authService.redirectToLogin(this.authService.getLogOutReason(true), redirectLocation);

    return false;

  }

}
