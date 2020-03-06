import {Injectable} from '@angular/core';
import {CanActivate, CanActivateChild, Router, UrlTree} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
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
              private envService: EnvironmentService,
              private router: Router) {}

  /**
   * @see canActivateInternal
   */
  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivateRoute(state);

  }

  /**
   * @see canActivateInternal
   */
  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.canActivateRoute(state);

  }

  private canActivateRoute(state: RouterStateSnapshot): UrlTree | boolean {

    if (this.isAllowedToActivateRoute()) {
      return true;
    }

    return this.router.createUrlTree(
      ['/login'],
      {
        queryParams: {'redirect': state.url, 'reason': this.authService.getLogOutReason(true)},
        queryParamsHandling: 'merge'
      }
    );

  }

  /**
   * Whether the client may access the requested page or
   * be redirected to the login page.
   * @returns {boolean} true if admin routes may be currently accessed; false otherwise
   */
  public isAllowedToActivateRoute(): boolean {

    const isLoggedIn = this.authService.isLoggedIn();
    const isAccessGranted = this.authService.getJWTToken().exp * 1000 - this.envService.security.jwtTokenExpireMs + this.envService.security.adminTimeoutMs >= new Date().getTime();

    return isLoggedIn && isAccessGranted;

  }

}
