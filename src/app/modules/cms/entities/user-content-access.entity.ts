/**
 *
 *
 * @author Laurenz Fiala
 * @since 2022/03/20
 */
import {Role} from '../../trees/entities/role.entity';
import {UserContentAccessRole} from './user-content-access-role.entity';
import {EnvironmentService} from '../../shared/services/environment.service';

export class UserContentAccess {

  public id: number;
  public contentPath: string;
  public enabled: boolean;
  public keepHistory: boolean;
  public description: string;
  public anonAllowView: boolean;
  public anonAllowEdit: boolean;
  public anonApprovalByRole: Role;
  public userAllowView: boolean;
  public userAllowEdit: boolean;
  public userApprovalByRole: Role;
  public roleAccess: Array<UserContentAccessRole>;

  constructor(id: number,
              contentPath: string,
              enabled: boolean,
              keepHistory: boolean,
              description: string,
              anonAllowView: boolean,
              anonAllowEdit: boolean,
              anonApprovalByRole: Role,
              userAllowView: boolean,
              userAllowEdit: boolean,
              userApprovalByRole: Role,
              roleAccess: Array<UserContentAccessRole>) {
    this.id = id;
    this.contentPath = contentPath;
    this.enabled = enabled;
    this.keepHistory = keepHistory;
    this.description = description;
    this.anonAllowView = anonAllowView;
    this.anonAllowEdit = anonAllowEdit;
    this.anonApprovalByRole = anonApprovalByRole;
    this.userAllowView = userAllowView;
    this.userAllowEdit = userAllowEdit;
    this.userApprovalByRole = userApprovalByRole;
    this.roleAccess = roleAccess;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of SerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): UserContentAccess {

    if (!o) {
      return null;
    }

    return new UserContentAccess(
      o.id,
      o.contentPath,
      o.enabled,
      o.keephistory,
      o.description,
      o.anonAllowView,
      o.anonAllowEdit,
      o.anonApprovalByRole && Role.fromObject(o.anonApprovalByRole),
      o.userAllowView,
      o.userAllowEdit,
      o.userApprovalByRole && Role.fromObject(o.userApprovalByRole),
      o.roleAccess && o.roleAccess.map(ra => UserContentAccessRole.fromObject(ra, envService))
    );

  }

}
