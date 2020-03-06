import {Injectable} from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from './environment.service';
import {AbstractService} from './abstract.service';
import {AuthService} from './auth.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AdminGuard} from '../components/admin/admin.guard';
import {ProjectLoginGuard} from '../components/project-login/project-login.guard';

/**
 * Service for advanced auth functionality that is not
 * vital to the applications core functionality.
 *
 * @author Laurenz Fiala
 * @since 2019/09/20
 */
@Injectable()
export class AuthHelperService extends AbstractService {

  private static LOG: Log = Log.newInstance(AuthHelperService);

  constructor(private authService: AuthService,
              private envService: EnvironmentService,
              private adminGuard: AdminGuard,
              private loginGuard: ProjectLoginGuard) {
    super();
  }

  public shouldShowAuthTimeoutNotification(routeSnapshot: ActivatedRouteSnapshot): boolean {

    if (!routeSnapshot.data || !routeSnapshot.data.showAuthTimeout) {
      return false;
    }

    const roles = routeSnapshot.data.roles;

    if (!this.loginGuard.isAllowedToActivateRoute(routeSnapshot) ||
       (this.hasAnyRole(roles, this.envService.security.rolesAdmin) && !this.adminGuard.isAllowedToActivateRoute())) {
      return true;
    }

    return false;

  }

  private hasAnyRole(roles: Array<string>, anyOf: Array<string>): boolean {

    if (!roles) {
      return false;
    }

    for (let checkRole of anyOf) {
      if (roles.indexOf(checkRole) !== -1) {
        return true;
      }
    }
    return false;

  }

}
