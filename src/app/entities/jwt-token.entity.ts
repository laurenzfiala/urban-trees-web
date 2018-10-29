/**
 * Describes JWT tokens returned from the backend.
 *
 * @author Laurenz Fiala
 * @since 2018/07/08
 */
export class JWTToken {

  /**
   * Character to use for splitting
   * the rol field into valid roles.
   */
  private static ROLE_SPLIT_CHAR: string = ',';

  /**
   * JWT standard.
   * Subject to which the token is directed towards.
   */
  public sub: string;

  /**
   * JWT standard.
   * Expiry date in seconds since Unix epoch of the
   * token after which the backend requires renewed
   * authentication.
   */
  public exp: number;

  /**
   * Custom.
   * Roles granted to the subject.
   */
  public rol: string;

  constructor(sub: string, exp: number, rol: string) {
    this.sub = sub;
    this.exp = exp;
    this.rol = rol;
  }

  /**
   * Splits #rol by #ROLE_SPLIT_CHAR and returns
   * the array of roles granted to the subject
   * of this token.
   * Returns null if #rol is falsy.
   */
  public getRoles(): Array<string> {
    if (!this.rol) {
      return null;
    }
    return this.rol.split(JWTToken.ROLE_SPLIT_CHAR);
  }

  public static fromObject(o: any): JWTToken {

    return new JWTToken(
      o.sub,
      o.exp,
      o.rol,
    );

  }

}
