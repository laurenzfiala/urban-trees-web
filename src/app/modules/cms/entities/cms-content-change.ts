/**
 * A single tracked change for serialized cms content
 * in ContentComponent.
 * Similar to CmsContent, but intentionally kept separate because different
 * usages are targeted.
 *
 * @author Laurenz Fiala
 * @since 2022/06/21
 */
import {SerializedCmsContent} from './serialized-cms-content.entity';
import {EnvironmentService} from '../../shared/services/environment.service';
import * as moment from 'moment';
import {CmsContent} from './cms-content.entity';

export class CmsContentChange {

  /**
   * The Date at which this object was generated.
   * @see SerializationService#serializeContent(Array<CmsElement>)
   */
  public saved: Date;

  /**
   * The Date at which this object was sent to the backend.
   * Note: this is not the same as the date the object is persisted.
   */
  public sent: Date;

  /**
   * The Date at which this object was persisted on the backend.
   */
  public stored: Date;

  public isDraft: boolean;

  /**
   * Serialized content (that is stored untyped in the backend).
   */
  public readonly content: SerializedCmsContent;

  constructor(saved?: Date,
              sent?: Date,
              stored?: Date,
              isDraft?: boolean,
              content?: SerializedCmsContent) {
    this.saved = saved;
    this.sent = sent;
    this.stored = stored;
    this.isDraft = isDraft;
    this.content = content;
  }

  public isSaved(): boolean {
    return !!this.saved;
  }

  public isSent(): boolean {
    return !!this.sent;
  }

  public isStored(): boolean {
    return !!this.stored;
  }

  /**
   * TODO doc
   */
  public toCmsContent(base: CmsContent): CmsContent {
    return new CmsContent(
      base.historyId,
      base.previousId,
      base.nextId,
      this.saved,
      this.sent,
      this.stored,
      this.content
    );

  }

  /**
   * TODO doc
   */
  public static fromCmsContent(cmsContent: CmsContent, envService: EnvironmentService): CmsContentChange {

    if (!cmsContent) {
      throw new Error('Unexpected falsy CMS content');
    }

    return new CmsContentChange(
      cmsContent.saved && moment.utc(cmsContent.saved, envService.outputDateFormat).toDate(),
      cmsContent.sent && moment.utc(cmsContent.sent, envService.outputDateFormat).toDate(),
      undefined,
      undefined,
      cmsContent && SerializedCmsContent.fromObject(cmsContent.content, envService)
    );

  }

}
