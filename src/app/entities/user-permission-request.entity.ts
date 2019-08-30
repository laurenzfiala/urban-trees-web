/**
 * Holds information for updating a single user permission.
 *
 * @author Laurenz Fiala
 * @since 2019/08/12
 */
export class UserPermissionRequest {

  public username: string;
  public password: string;
  public permission: string;

  constructor(username?: string,
              password?: string,
              permission?: string) {
    this.username = username;
    this.password = password;
    this.permission = permission;
  }

  public static fromObject(o: any): UserPermissionRequest {

    return new UserPermissionRequest(
      o.username,
      o.password,
      o.permission
    );

  }

}
