/**
 * Holds information on a backend CMS content entry
 * (including its actual content).
 */
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {UserIdentity} from '../../trees/entities/user-identity.entity';
import {UserContentMetadata} from './user-content-metadata.entity';
import {UserContentStatus} from './user-content-status.entity';
import {CmsContent} from './cms-content.entity';

export class UserContent extends UserContentMetadata {

  public readonly content: string;

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
              approveUser: UserIdentity,
              content: any) {
    super(
      id,
      contentPath,
      contentTitle,
      contentLanguage,
      status,
      saveDate,
      historyId,
      previousId,
      nextId,
      user,
      approveDate,
      approveUser
    );
    this.content = content;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of CmsContentMetadata with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): UserContent {

    if (!o) {
      return null;
    }

    return new UserContent(
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
      o.approveUser && UserIdentity.fromObject(o.approveUser),
      o.content
    );

  }

  public static create(contentPath: string, contentLang: string): UserContent {
    return new UserContent(
      null,
      contentPath,
      null,
      contentLang,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

}
