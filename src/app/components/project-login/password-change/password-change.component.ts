import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PasswordReset} from '../../../entities/password-reset.entity';
import {AbstractComponent} from '../../abstract.component';
import {Log} from '../../../services/log.service';

@Component({
  selector: 'ut-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.less', '../project-login.component.less']
})
export class PasswordChangeComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(PasswordChangeComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(private authService: AuthService) {
    super();
  }

  ngOnInit() {
  }

  public changePassword(pwdReset: PasswordReset): void {

    this.setStatus(StatusKey.PASSWORD_CHANGE, StatusValue.IN_PROGRESS);

    this.authService.changePassword(pwdReset, () => {
      PasswordChangeComponent.LOG.info('Successfully changed password');
      this.setStatus(StatusKey.PASSWORD_CHANGE, StatusValue.SUCCESSFUL);
    }, error => {
      PasswordChangeComponent.LOG.error('Failed to change password', error);
      this.setStatus(StatusKey.PASSWORD_CHANGE, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  PASSWORD_CHANGE

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
