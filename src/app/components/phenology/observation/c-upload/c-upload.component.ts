import {Component, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {Log} from '../../../../services/log.service';
import {PhenologyDatasetFrontend} from '../../../../entities/phenology-dataset-frontend.entity';

@Component({
  selector: 'ut-c-upload',
  templateUrl: './c-upload.component.html',
  styleUrls: ['./c-upload.component.less']
})
export class CUploadComponent implements OnInit {

  private static LOG: Log = Log.newInstance(CUploadComponent);

  constructor(private observationService: PhenologyObservationService) {
  }

  public ngOnInit(): void {
    this.checkContinue();
  }

  /**
   * Check if we can continue to the next step.
   */
  public checkContinue() {
    let observers = this.dataset.observers;
    if (observers) {
      this.observationService.setContinue(observers.length >= 10);
    }
  }

  /**
   * Check if we can continue to the next step.
   */
  public setUserImage(event: any) {
    this.observationService.userImage = event.target.files.item(0);
  }

  get userImageName(): String {
    if (!this.observationService.userImage) {
      return null;
    }
    return this.observationService.userImage.name;
  }

  get dataset(): PhenologyDatasetFrontend {
    return this.observationService.dataset;
  }

}
