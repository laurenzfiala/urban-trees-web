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

  public passwordStrength: number = 0;

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

    const SINGLE_VAL_SCORE: number = 50;

    const pw = this.passwordReset.newPassword;
    let score = 0;

    // lowercase alphabetic chars
    let lowerLetterChars = (pw.match(/[a-z]/g) || []).length;
    if ((lowerLetterChars - pw.length) !== 0) {
      score += lowerLetterChars * SINGLE_VAL_SCORE;
    }

    // lowercase alphabetic chars
    let upperLetterChars = (pw.match(/[A-Z]/g) || []).length;
    if ((upperLetterChars - pw.length) !== 0) {
      score += upperLetterChars * SINGLE_VAL_SCORE;
    }

    // numeric chars
    let numericChars = (pw.match(/[0-9]/g) || []).length;
    if ((numericChars - pw.length) !== 0) {
      score += numericChars * SINGLE_VAL_SCORE;
    }

    // special chars
    let specialChars = (pw.match(/[^a-zA-Z0-9]/g) || []).length;
    if ((specialChars - pw.length) !== 0) {
      score += specialChars * SINGLE_VAL_SCORE;
    }

    if (score !== 0) {
      score += (lowerLetterChars+1) * (upperLetterChars+1) * (numericChars+1) * (specialChars+1) / 3;
    }

    if (score > 100) {
      score = 100;
    }

    this.passwordStrength = score;

    if (score < 100) {
      this.passwordStrengthClass = 'is-weak';
    } else {
      this.passwordStrengthClass = 'is-strong';
    }

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
    return this.passwordReset.oldPassword && this.isNewPasswordsMatching() && this.passwordStrength === 100;
  }

}

export enum PasswordResetStatus {

  INITIAL,
  UPDATING_PASSWORD

}
