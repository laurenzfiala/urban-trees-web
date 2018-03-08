import {Injectable} from '@angular/core';
import {CanActivateChild, Router} from '@angular/router';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/src/router_state';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';
import {DFinishComponent} from './d-finish/d-finish.component';
import {BObservationComponent} from './b-observation/b-observation.component';
import {AInfoComponent} from './a-info/a-info.component';
import {CUploadComponent} from './c-upload/c-upload.component';
import {Log} from '../../../services/log.service';
import {ObservationComponent} from './observation.component';

@Injectable()
export class PhenologyObservationStepGuard implements CanActivateChild {

  private static LOG: Log = Log.newInstance(BObservationComponent);

  constructor(private observationService: PhenologyObservationService,
              private router: Router) {}

  public canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    let component = childRoute.component;
    if (component === AInfoComponent) {
      this.observationService.currentStepIndex = 0;
    } else if (component === BObservationComponent) {
      this.observationService.currentStepIndex = 1;
    } else if (component === CUploadComponent) {
      this.observationService.currentStepIndex = 2;
    } else if (component === DFinishComponent) {
      this.observationService.currentStepIndex = 3;
    }

    if (this.observationService.currentStepIndex > this.observationService.finishedStepIndex + 1) {
      this.router.navigate([state.url.substring(0, state.url.lastIndexOf('/')), '1']);
      return false;
    }
    return true;
  }

}
