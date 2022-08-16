/**
 *
 *
 * @author Laurenz Fiala
 * @since 2022/03/20
 */
import {UserContentAccess} from './user-content-access.entity';
import {EnvironmentService} from '../../shared/services/environment.service';

export class UserContentManagerAccess {

  public access: UserContentAccess;
  public affectedContentAmount: number;

  constructor(access: UserContentAccess, affectedContentAmount: number) {
    this.access = access;
    this.affectedContentAmount = affectedContentAmount;
  }

  public toString(): string {
    return this.access.description ? this.access.description : this.access.contentPath;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of SerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): UserContentManagerAccess {

    if (!o) {
      return null;
    }

    return new UserContentManagerAccess(
      o.access && UserContentAccess.fromObject(o.access, envService),
      o.affectedContentAmount
    );

  }

}
