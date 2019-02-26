/**
 * Login entity to send to the backend for authentication.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
export class Login {

  public username: string;
  public password: string;
  public secureLoginKey: string;

  constructor (username: string, password: string, secureLoginKey?: string) {
    this.username = username;
    this.password = password;
    this.secureLoginKey = secureLoginKey;
  }

}
