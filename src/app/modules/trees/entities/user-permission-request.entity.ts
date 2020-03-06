/**
 * Holds information for updating a single user permission.
 *
 * @author Laurenz Fiala
 * @since 2019/08/12
 */
export class UserPermissionRequest {

  public username: string;
  public ppin: string;
  public permission: string;

  constructor(username?: string,
              ppin?: string,
              permission?: string) {
    this.username = username;
    this.ppin = ppin;
    this.permission = permission;
  }

  public static fromObject(o: any): UserPermissionRequest {

    return new UserPermissionRequest(
      o.username,
      o.ppin,
      o.permission
    );

  }

}
