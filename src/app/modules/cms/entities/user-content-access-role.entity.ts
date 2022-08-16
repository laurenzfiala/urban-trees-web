/**
 *
 *
 * @author Laurenz Fiala
 * @since 2022/03/20
 */
import {Role} from '../../trees/entities/role.entity';
import {EnvironmentService} from '../../shared/services/environment.service';
import * as moment from 'moment';
import {SerializedCmsContent} from './serialized-cms-content.entity';

export class UserContentAccessRole {

  public id: number;
  public contentAccessId: number;
  public role: Role;
  public allowView: boolean;
  public allowEdit: boolean;
  public approvalByRole: Role;

  constructor(id: number, contentAccessId: number, role: Role, allowView: boolean, allowEdit: boolean, approvalByRole: Role) {
    this.id = id;
    this.contentAccessId = contentAccessId;
    this.role = role;
    this.allowView = allowView;
    this.allowEdit = allowEdit;
    this.approvalByRole = approvalByRole;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of SerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): UserContentAccessRole {

    if (!o) {
      return null;
    }

    return new UserContentAccessRole(
      o.id,
      o.contentAccessId,
      o.role && Role.fromObject(o.role),
      o.allowView,
      o.allowEdit,
      o.approvalByRole && Role.fromObject(o.approvalByRole)
    );

  }

}
