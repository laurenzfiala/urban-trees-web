/**
 * Holds meta-information a backend CMS content entry.
 */
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {UserContentStatus} from './user-content-status.entity';
import {User} from '../../trees/entities/user.entity';

export class UserContentMetadata {

  public readonly id: number;
  public readonly contentPath: string;
  public readonly contentTitle: string;
  public readonly contentLanguage: string;
  public readonly status: UserContentStatus;
  public readonly saveDate: Date;
  public readonly historyId: number;
  public readonly previousId: number;
  public readonly nextId: number;
  public readonly user: UserIdentity;
  public readonly approveDate: Date;
  public readonly approveUser: UserIdentity;

  constructor(id: number,
              contentPath: string,
              contentTitle: string,
              contentLanguage: string,
              status: UserContentStatus,
              saveDate: Date,
              historyId: number,
              previousId: number,
              nextId: number,
              user: UserIdentity,
              approveDate: Date,
              approveUser: UserIdentity) {
    this.id = id;
    this.contentPath = contentPath;
    this.contentTitle = contentTitle;
    this.contentLanguage = contentLanguage;
    this.status = status;
    this.saveDate = saveDate;
    this.historyId = historyId;
    this.previousId = previousId;
    this.nextId = nextId;
    this.user = user;
    this.approveDate = approveDate;
    this.approveUser = approveUser;
  }

  public getStatus(): UserContentStatus {
    return this.status;
  }

  public getStatusString(): string {
    return UserContentStatus[this.getStatus()];
  }

  /**
   * Crete a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of CmsContentMetadata with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): UserContentMetadata {

    if (!o) {
      return null;
    }

    return new UserContentMetadata(
      o.id,
      o.contentPath,
      o.contentTitle,
      o.contentLanguage,
      UserContentStatus[o.status],
      o.saveDate && moment.utc(o.saveDate, envService.outputDateFormat).toDate(),
      o.historyId,
      o.previousId,
      o.nextId,
      o.user && UserIdentity.fromObject(o.user),
      o.approveDate && moment.utc(o.approveDate, envService.outputDateFormat).toDate(),
      o.approveUser && UserIdentity.fromObject(o.approveUser)
    );

  }

}
