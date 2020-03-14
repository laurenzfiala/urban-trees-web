/**
 * For updating passwords of a user.
 *
 * @author Laurenz Fiala
 * @since 2018/07/14
 */
export class PasswordReset {

  public oldPassword: string;
  public newPassword: string;

  constructor(oldPassword?: string, newPassword?: string) {
    this.oldPassword = oldPassword;
    this.newPassword = newPassword;
  }

}
