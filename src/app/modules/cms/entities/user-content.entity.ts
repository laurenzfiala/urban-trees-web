/**
 * Holds information on a backend CMS content entry
 * (including its actual content).
 */
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {ContentStatus} from '../enums/cms-content-status.enum';
import {SerializedCmsContent} from './serialized-cms-content.entity';
import {UserContentMetadata} from './user-content-metadata.entity';

export class UserContent extends UserContentMetadata {

  public readonly content: SerializedCmsContent;

  constructor(id: number,
              contentId: string,
              contentTitle: string,
              contentLanguage: string,
              isDraft: boolean,
              saveDate: Date,
              user: UserIdentity,
              approveDate: Date,
              approveUser: UserIdentity,
              content: SerializedCmsContent) {
    super(id, contentId, contentTitle, contentLanguage, isDraft, saveDate, user, approveDate, approveUser);
    this.content = content;
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

    return new UserContent(
      o.id,
      o.contentId,
      o.contentTitle,
      o.contentLanguage,
      o.draft,
      o.saveDate && moment.utc(o.saveDate, envService.outputDateFormat).toDate(),
      o.user && UserIdentity.fromObject(o.user),
      o.approveDate && moment.utc(o.approveDate, envService.outputDateFormat).toDate(),
      o.approveUser && UserIdentity.fromObject(o.approveUser),
      o.content && SerializedCmsContent.fromObject(o.content, envService)
    );

  }

}
