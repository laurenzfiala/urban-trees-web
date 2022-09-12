/**
 * Login entity to send to the backend for authentication of user with password.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
export interface AuthenticationToken {
}

/**
 * Login entity to send to the backend for authentication of user with password.
 *
 * @author Laurenz Fiala
 * @since 2018/06/12
 */
export class UserAuthenticationToken implements AuthenticationToken{

  public username: string;
  public password: string;

  constructor (username: string, password: string) {
    this.username = username;
    this.password = password;
  }

}

/**
 * Login entity to send to the backend for authentication of user with password and OTP.
 *
 * @author Laurenz Fiala
 * @since 2020/05/04
 */
export class UserOtpAuthenticationToken extends UserAuthenticationToken implements AuthenticationToken {

  public otp: string;

  constructor (username: string, password: string, otp?: string) {
    super(username, password);
    this.otp = otp;
  }

}

/**
 * Login entity to send to the backend for authentication of user with a secure login link.
 *
 * @author Laurenz Fiala
 * @since 2020/05/04
 */
export class TokenAuthenticationToken implements AuthenticationToken {

  public secureLoginKey: string;
  public secureLoginKeyPin: string;

  constructor (secureLoginKey: string, secureLoginKeyPin: string) {
    this.secureLoginKey = secureLoginKey;
    this.secureLoginKeyPin = secureLoginKeyPin;
  }

}
