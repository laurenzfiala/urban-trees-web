/**
 * Holds only user identifying information.
 *
 * @author Laurenz Fiala
 * @since 2019/08/08
 */
export class UserIdentity {

  public id: number;
  public username: string;

  constructor(id?: number,
              username?: string) {
    this.id = id;
    this.username = username;
  }

  public static fromObject(o: any): UserIdentity {

    return new UserIdentity(
      o.id,
      o.username
    );

  }

}
