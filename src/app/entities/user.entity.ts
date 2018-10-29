/**
 * Holds user account information.
 *
 * @author Laurenz Fiala
 * @since 2018/07/08
 */
export class User {

  public id: number;
  public username: string;
  public email: string;

  constructor(id: number, username: string, email: string) {
    this.id = id;
    this.username = username;
    this.email = email;
  }

  public static fromObject(o: any): User {

    return new User(
      o.id,
      o.username,
      o.email
    );

  }

}
