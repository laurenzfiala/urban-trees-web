import {Component, OnInit, ViewChild} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {Log} from '../../../../services/log.service';
import {PhenologyDatasetFrontend} from '../../../../entities/phenology-dataset-frontend.entity';
import {AbstractComponent} from '../../../abstract.component';
import {AuthService} from '../../../../services/auth.service';
import {LoginStatus} from '../../../project-login/login-status.enum';

@Component({
  selector: 'ut-c-upload',
  templateUrl: './c-upload.component.html',
  styleUrls: ['./c-upload.component.less'],

})
export class CUploadComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(CUploadComponent);

  public UserImageError = UserImageError;

  @ViewChild('observersInput', { static: true })
  public observersInput: any;

  /**
   * TODO
   */
  public username: string;

  constructor(private observationService: PhenologyObservationService,
              public authService: AuthService) {
    super();
  }

  public ngOnInit(): void {
    this.username = this.authService.getUsername();
    if (this.isLoginNotAnonymous()) {
      this.dataset.observers = this.username;
    }

    this.scrollToTop();
    this.checkContinue();
  }

  /**
   * Check if we can continue to the next step.
   */
  public checkContinue() {
    this.observationService.setDone(2,
      this.dataset.observers &&
      (this.isLoginNotAnonymous() || this.dataset.observers.length >= 5) &&
      this.isUserImageValid(),
      true
    );
  }

  public isLoginNotAnonymous(): boolean {
    return this.username !== undefined;
  }

  /**
   * Set the user upload image in the service.
   */
  public setUserImage(event: any) {
    CUploadComponent.LOG.info('Setting user image', event);
    this.observationService.userImage = event.target.files.item(0);
  }

  public isUserImageValid(): boolean {
    return this.getUserImageErrors().length === 0;
  }

  /**
   * Check if the image is valid and of the right type.
   * @returns {UserImageError[]} array of errors found or empty array.
   */
  public getUserImageErrors(): UserImageError[] {

    let errors = new Array<UserImageError>();
    if (!this.observationService.userImage) {
      return errors;
    }

    if (['image/jpeg', 'image/png'].indexOf(this.observationService.userImage.type) === -1) {
      errors.push(UserImageError.INVALID_TYPE);
    }
    if (this.userImage.size > 5242880) {
      errors.push(UserImageError.INVALID_SIZE);
    }
    return errors;
  }

  get userImageName(): String {
    if (!this.observationService.userImage) {
      return null;
    }
    return this.observationService.userImage.name;
  }

  get userImage(): any {
    return this.observationService.userImage;
  }

  get dataset(): PhenologyDatasetFrontend {
    return this.observationService.dataset;
  }

}

/**
 *
 */
export enum UserImageError {
  INVALID_TYPE,
  INVALID_SIZE
}
