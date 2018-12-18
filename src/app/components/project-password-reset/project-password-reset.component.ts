import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {PasswordReset} from '../../entities/password-reset.entity';

@Component({
  selector: 'ut-project-password-reset',
  templateUrl: './project-password-reset.component.html',
  styleUrls: ['./project-password-reset.component.less']
})
export class ProjectPasswordResetComponent extends AbstractComponent {

  @Output()
  public submitChange: EventEmitter<PasswordReset> = new EventEmitter<PasswordReset>();

  @Input()
  public status: PasswordResetStatus = PasswordResetStatus.INITIAL;

  public PasswordResetStatus = PasswordResetStatus;

  /**
   * Contains the model and is emitted to the
   * parent component.
   */
  public passwordReset: PasswordReset = new PasswordReset();

  public newPasswordConfirm: string;

  public isPasswordValid: boolean = false;

  public passwordStrengthClass: string = '';

  constructor() {
    super();
  }

  /**
   * Emit the passwordreset object.
   */
  public changePassword(): void {
    this.submitChange.emit(this.passwordReset);
  }

  /**
   * TODO
   */
  public checkPasswordStrength(): void {

    const pw = this.passwordReset.newPassword;
    let passwordValid = false;

    // lowercase alphabetic chars
    let lowerLetterChars = (pw.match(/[a-z]/g) || []).length;
    let upperLetterChars = (pw.match(/[A-Z]/g) || []).length;
    let numericChars = (pw.match(/[0-9]/g) || []).length;
    let specialChars = (pw.match(/[^a-zA-Z0-9]/g) || []).length;

    if (lowerLetterChars !== 0 &&
      upperLetterChars !== 0 &&
      numericChars !== 0 &&
      specialChars !== 0 &&
      pw.length >= 10) {
      passwordValid = true;
    }

    this.isPasswordValid = passwordValid;

  }

  /**
   * TODO
   * @returns {boolean}
   */
  public isNewPasswordsMatching(): boolean {
    return this.passwordReset.newPassword === this.newPasswordConfirm;
  }

  /**
   * TODO
   * @returns {boolean}
   */
  public isValid(): boolean {
    return this.passwordReset.oldPassword && this.isNewPasswordsMatching() && this.isPasswordValid;
  }

}

export enum PasswordResetStatus {

  INITIAL,
  UPDATING_PASSWORD

}
