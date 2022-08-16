/**
 * Holds meta-information a backend CMS content entry.
 */
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {UserContentStatus, UserContentStatusHelper} from './user-content-status.entity';
import {User} from '../../trees/entities/user.entity';

export class UserContentMetadata {

  public id: number;
  public contentPath: string;
  public contentTitle: string;
  public contentLanguage: string;
  public status: UserContentStatus;
  public saveDate: Date;
  public historyId: number;
  public previousId: number;
  public nextId: number;
  public user: UserIdentity;
  public approveDate: Date;
  public approveUser: UserIdentity;

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

  public isStatusPermanent(): boolean {
    return UserContentStatusHelper.isPermanent(this.status);
  }

  public isStatusTransient(): boolean {
    return UserContentStatusHelper.isTransient(this.status);
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
      o.contentLanguage.id,
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
