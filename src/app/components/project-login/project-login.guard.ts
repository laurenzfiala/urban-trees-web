import {Injectable} from '@angular/core';
import {CanActivateChild} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import {Log} from '../../services/log.service';

@Injectable()
export class PhenologyObservationStepGuard implements CanActivateChild {

  private static LOG: Log = Log.newInstance(PhenologyObservationStepGuard);

  constructor(/*private auth: AuthenticationService*/) {}

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    return true;

  }

}
