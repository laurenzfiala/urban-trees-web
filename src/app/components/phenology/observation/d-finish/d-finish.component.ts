import {Component, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {Log} from '../../../../services/log.service';
import {PhenologyObservationResult} from '../../../../entities/phenology-observation-result.entity';
import {AbstractComponent} from '../../../abstract.component';

@Component({
  selector: 'ut-d-finish',
  templateUrl: './d-finish.component.html',
  styleUrls: ['./d-finish.component.less']
})
export class DFinishComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(DFinishComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(public observationService: PhenologyObservationService) {
    super();
  }

  public ngOnInit() {
  }

  /**
   * Submits the observation and uploads the results
   * to the backend.
   */
  public onSubmit() {

    this.setStatus(StatusKey.SUBMISSION, StatusValue.IN_PROGRESS);
    this.observationService.submit(() => {
      this.setStatus(StatusKey.SUBMISSION, StatusValue.SUCCESSFUL);
    }, () => {
      this.setStatus(StatusKey.SUBMISSION, StatusValue.FAILED);
    });

  }

  public getObservationResultAmount(result: PhenologyObservationResult) {

    let amount = 0;
    for (let o of this.dataset.observations) {
      if (o.result.id === result.id) {
        amount++;
      }
    }

    return amount;

  }

  get dataset() {
    return this.observationService.dataset;
  }

  get selectedTree() {
    return this.observationService.selectedTree;
  }

}

export enum StatusKey {

  SUBMISSION,
  SUBMISSION_DETAIL

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,

  SENDING_OBSERVATION,
  SENDING_FILE

}
