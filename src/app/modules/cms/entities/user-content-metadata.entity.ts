/**
 * Holds meta-information a backend CMS content entry.
 */
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {ContentStatus} from '../enums/cms-content-status.enum';

export class UserContentMetadata {

  public readonly id: number;
  public readonly contentId: string;
  public readonly contentTitle: string;
  public readonly contentLanguage: string;
  public readonly isDraft: boolean;
  public readonly saveDate: Date;
  public readonly historyId: number;
  public readonly user: UserIdentity;
  public readonly approveDate: Date;
  public readonly approveUser: UserIdentity;

  constructor(id: number,
              contentId: string,
              contentTitle: string,
              contentLanguage: string,
              isDraft: boolean,
              saveDate: Date,
              historyId: number,
              user: UserIdentity,
              approveDate: Date,
              approveUser: UserIdentity) {
    this.id = id;
    this.contentId = contentId;
    this.contentTitle = contentTitle;
    this.contentLanguage = contentLanguage;
    this.isDraft = isDraft;
    this.saveDate = saveDate;
    this.historyId = historyId;
    this.user = user;
    this.approveDate = approveDate;
    this.approveUser = approveUser;
  }

  /**
   * @see ContentStatus
   */
  public getStatus(): ContentStatus {

    if (this.isDraft) {
      return ContentStatus.DRAFT;
    }
    if (!this.isDraft && this.approveDate == null) {
      return ContentStatus.PUBLISHING;
    }
    return ContentStatus.PUBLISHED;

  }

  /**
   * @see ContentStatus
   */
  public getStatusString(): string {
    return ContentStatus[this.getStatus()];
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
      o.contentId,
      o.contentTitle,
      o.contentLanguage,
      o.draft,
      o.saveDate && moment.utc(o.saveDate, envService.outputDateFormat).toDate(),
      o.historyId,
      o.user && UserIdentity.fromObject(o.user),
      o.approveDate && moment.utc(o.approveDate, envService.outputDateFormat).toDate(),
      o.approveUser && UserIdentity.fromObject(o.approveUser)
    );

  }

}
