import {Component, OnInit} from '@angular/core';
import {Log} from '../../../shared/services/log.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {EnvironmentService} from '../../../shared/services/environment.service';

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
    }, error => {
      UsernameChangeComponent.LOG.error('Failed to change username', error);
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
  FAILED

}
