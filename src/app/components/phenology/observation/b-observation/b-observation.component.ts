import {Component, OnDestroy, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {Log} from '../../../../services/log.service';
import {AbstractComponent} from '../../../abstract.component';
import {PhenologyObservationTypeFrontend} from '../../../../entities/phenology-observation-type-frontend.entity';
import {PhenologyObservation} from '../../../../entities/phenology-observation.entity';
import {Tree} from '../../../../entities/tree.entity';

@Component({
  selector: 'ut-b-observation',
  templateUrl: './b-observation.component.html',
  styleUrls: ['./b-observation.component.less']
})
export class BObservationComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(BObservationComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(public observationService: PhenologyObservationService) {
    super();
  }

  public ngOnInit(): void {

    BObservationComponent.LOG.trace('Initializing BObservationComponent...');
    this.loadSpec();

  }

  /**
   * Save the current observation to the service.
   */
  public ngOnDestroy(): void {

    BObservationComponent.LOG.trace('Destroying BObservationComponent...');

    let dataset = this.observationService.dataset;
    dataset.observations = new Array<PhenologyObservation>();
    for (let type of this.observationSpec) {

      Object.keys(type.resultMap).forEach(key => {

        let observation = new PhenologyObservation();
        observation.object = type.objects.find(o => o.id.toString() === key);
        observation.result = type.resultMap[key];

        dataset.observations.push(observation);

      });

    }

  }

  private loadSpec(): void {
    this.setStatus(StatusKey.SPEC, StatusValue.IN_PROGRESS);
    this.observationService.loadObservationSpec((types: Array<PhenologyObservationTypeFrontend>) => {
      for (let t of types) {
        for (let r of t.results) {
          this.loadResultImage(r.id);
        }
      }
      this.checkObservationStatus();
      this.setStatus(StatusKey.SPEC, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.SPEC, StatusValue.FAILED);
    });
  }

  private loadResultImage(resultId: number) {
    this.observationService.loadResultImg(resultId, () => {
    }, (error, apiError) => {
      this.setStatus(StatusKey.SPEC, StatusValue.FAILED);
    });
  }

  public checkObservationStatus(type?: PhenologyObservationTypeFrontend): void {

    if (type && Object.keys(type.resultMap).length === type.objects.length) {
      type.done = true;
    }

    for (let t of this.observationService.observationSpec) {
      if (!t.done) {
        return;
      }
    }
    this.observationService.setContinue(true);

  }

  get images() {
    return this.observationService.images;
  }

  get observationSpec() {
    return this.observationService.observationSpec;
  }

}

export enum StatusKey {

  SPEC

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
