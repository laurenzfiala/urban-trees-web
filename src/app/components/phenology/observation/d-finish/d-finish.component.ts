import {Component, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {Log} from '../../../../services/log.service';
import {PhenologyObservationResult} from '../../../../entities/phenology-observation-result.entity';
import {AbstractComponent} from '../../../abstract.component';
import {ClientError} from '../../../../entities/client-error.entity';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-d-finish',
  templateUrl: './d-finish.component.html',
  styleUrls: ['./d-finish.component.less']
})
export class DFinishComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(DFinishComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public ClientError = ClientError;

  /**
   * ID of the submitted phenology observation.
   * This is used for sending the optional observation photo.
   */
  private phenologyId: number;

  /**
   * Percentage of user image currently uploaded.
   */
  public uploadUserImagePercentage: number = 0;

  constructor(public observationService: PhenologyObservationService,
              public translateService: TranslateService) {
    super();
  }

  public ngOnInit() {

    this.setStatus(StatusKey.SUBMISSION_DATA, StatusValue.PENDING);
    if (this.observationService.userImage) {
      this.setStatus(StatusKey.SUBMISSION_FILE, StatusValue.PENDING);
    }

  }

  /**
   * Submits the observation and uploads the results
   * to the backend.
   */
  public onSubmit() {

    this.observationService.setDone(0, false, true);

    this.setStatus(StatusKey.SUBMISSION_DATA, StatusValue.IN_PROGRESS);
    this.observationService.submit((phenologyId: number) => {
      this.phenologyId = phenologyId;
      this.setStatus(StatusKey.SUBMISSION_DATA, StatusValue.SUCCESSFUL);
      if (this.observationService.userImage) {
        this.submitFile();
      }
      this.observationService.markToBeReset();
    }, (error, apiError) => {
      this.setStatus(StatusKey.SUBMISSION_DATA, StatusValue.FAILED);
      if (apiError) {
        this.setStatus(StatusKey.SUBMISSION_DATA_DETAIL, apiError.clientErrorCode);
      }
    });

  }

  /**
   * Submit the uploaded file to the backend.
   */
  public submitFile() {

    this.setStatus(StatusKey.SUBMISSION_FILE, StatusValue.IN_PROGRESS);
    this.observationService.submitImg(this.phenologyId, () => {
      this.setStatus(StatusKey.SUBMISSION_FILE, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.SUBMISSION_FILE, StatusValue.FAILED);
    }).subscribe((progressPercentage: number) => {
      this.uploadUserImagePercentage = progressPercentage;
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

  SUBMISSION_DATA,
  SUBMISSION_DATA_DETAIL,
  SUBMISSION_FILE

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
