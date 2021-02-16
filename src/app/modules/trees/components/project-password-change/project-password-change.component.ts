import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PasswordReset} from '../../entities/password-reset.entity';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {AuthService} from '../../../shared/services/auth.service';
import {Log} from '../../../shared/services/log.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {LoginStatus} from '../project-login/login-status.enum';

@Component({
  selector: 'ut-project-password-change',
  templateUrl: './project-password-change.component.html',
  styleUrls: ['./project-password-change.component.less', '../project-login/project-login.component.less']
})
export class PasswordChangeComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(PasswordChangeComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Contains the model and is emitted to the
   * parent component.
   */
  public passwordReset: PasswordReset = new PasswordReset();

  public newPasswordConfirm: string;

  public username: string;

  constructor(private authService: AuthService,
              public envService: EnvironmentService,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {

    if (this.authService.isTempChangePasswordAuth()) {
      this.setStatus(StatusKey.FORCE_LOGOUT, StatusValue.YES);
    }

    this.username = this.authService.getUsername();

  }

  public changePassword(): void {

    this.setStatus(StatusKey.CHANGE_PASSWORD, StatusValue.IN_PROGRESS);

    this.authService.changePassword(this.passwordReset, () => {
      PasswordChangeComponent.LOG.info('Successfully changed password');
      this.setStatus(StatusKey.CHANGE_PASSWORD, StatusValue.SUCCESSFUL);

      if (this.hasStatus(StatusKey.FORCE_LOGOUT, StatusValue.YES)) {
        PasswordChangeComponent.LOG.info('Logging out user because logout after password change was forced');
        this.authService.logout();
        this.cdRef.detectChanges();
      }
    }, error => {
      PasswordChangeComponent.LOG.error('Failed to change password', error);
      this.setStatus(StatusKey.CHANGE_PASSWORD, StatusValue.FAILED);
    });

  }

  public isPasswordValid: (newVal: any) => boolean = (newPassword: string): boolean => {

    if (!newPassword) {
      return false;
    }

    let passwordValid = false;

    // lowercase alphabetic chars
    let lowerLetterChars = (newPassword.match(/[a-z]/g) || []).length;
    let upperLetterChars = (newPassword.match(/[A-Z]/g) || []).length;
    let numericChars = (newPassword.match(/[0-9]/g) || []).length;
    let specialChars = (newPassword.match(/[^a-zA-Z0-9]/g) || []).length;

    if (lowerLetterChars !== 0 &&
      upperLetterChars !== 0 &&
      numericChars !== 0 &&
      specialChars !== 0 &&
      newPassword.length >= this.envService.security.minPasswordLength) {
      passwordValid = true;
    }

    return passwordValid;

  }

  public isNewPasswordsMatching: (newVal: any) => boolean = (newPasswordConfirm: string): boolean => {

    return this.passwordReset.newPassword === newPasswordConfirm;

  }

  public showOldPasswordInput(): boolean {
    return !this.authService.isTempChangePasswordAuth() &&
           this.authService.getLogInStatus() === LoginStatus.LOGGED_IN_JWT;
  }

}

export enum StatusKey {

  CHANGE_PASSWORD,
  FORCE_LOGOUT

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  YES

}
