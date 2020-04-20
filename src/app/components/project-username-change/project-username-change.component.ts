import { Component, OnInit } from '@angular/core';
import {Log} from '../../services/log.service';
import {PasswordReset} from '../../entities/password-reset.entity';
import {AuthService} from '../../services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {EnvironmentService} from '../../services/environment.service';
import {ClientError} from '../../entities/client-error.entity';

@Component({
  selector: 'ut-project-username-change',
  templateUrl: './project-username-change.component.html',
  styleUrls: ['./project-username-change.component.less', '../project-login/project-login.component.less']
})
export class UsernameChangeComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(UsernameChangeComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public username: string;
  public newUsername: string;

  public isUsernameValid: (newVal: any) => boolean = (newUsername: any) => {
    return newUsername
      && newUsername !== this.authService.getUsername()
      && newUsername.length >= this.envService.security.minUsernameLength;
  };

  constructor(private authService: AuthService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  public changeUsername(): void {

    this.setStatus(StatusKey.CHANGE_USERNAME, StatusValue.IN_PROGRESS);

    this.authService.changeUsername(this.newUsername, () => {
      UsernameChangeComponent.LOG.info('Successfully changed username');
      this.setStatus(StatusKey.CHANGE_USERNAME, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      UsernameChangeComponent.LOG.error('Failed to change username', error);
      if (apiError && apiError.clientErrorCode === ClientError.USERNAME_DUPLICATE) {
        this.setStatus(StatusKey.CHANGE_USERNAME, StatusValue.FAILED_DUPLICATE);
        return;
      }
      this.setStatus(StatusKey.CHANGE_USERNAME, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  CHANGE_USERNAME

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  FAILED_DUPLICATE

}
