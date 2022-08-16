import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {SerializedCmsContent} from './serialized-cms-content.entity';
import {UserContent} from './user-content.entity';

/**
 * Holds meta-information on all content-elements (layout/component)
 * and its serialized data inside a cms-content-component.
 *
 * @author Laurenz Fiala
 * @since 2021/01/26
 */
export class CmsContent {

  /**
   * UID of the user content that proceeded this one (may be null/undefined if first entry).
   */
  public historyId: number;

  /**
   * UID of the user content that this content is supposed to be after.
   */
  public previousId: number;

  /**
   * UID of the user content that this content is supposed to be before.
   */
  public nextId: number;

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

  /**
   * Serialized content (that is stored untyped in the backend).
   */
  public readonly content: SerializedCmsContent;

  constructor(historyId?: number,
              previousId?: number,
              nextId?: number,
              saved?: Date,
              sent?: Date,
              stored?: Date,
              content?: SerializedCmsContent) {
    this.historyId = historyId;
    this.previousId = previousId;
    this.nextId = nextId;
    this.saved = saved;
    this.sent = sent;
    this.stored = stored;
    this.content = content;
  }

  /**
   * Iterates over all properties in this CMS content and
   * formats the dates using the global outputDateFormat.
   * @param envService environment vars service for date format
   * @return untyped object ready to send
   */
  public toJSONObject(envService: EnvironmentService): any {

    let result: any = {};
    for (let property in this) {
      let value;
      if (this[property] instanceof Date) {
        value = moment(value).utc().format(envService.outputDateFormat);
      } else {
        value = this[property];
      }

      result[property] = value;
    }

    return result;

  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of SerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): CmsContent {

    if (!o) {
      return null;
    }

    return new CmsContent(
      o.historyId,
      o.previousId,
      o.nextId,
      o.saved && moment.utc(o.saved, envService.outputDateFormat).toDate(),
      o.sent && moment.utc(o.sent, envService.outputDateFormat).toDate(),
      o.stored && moment.utc(o.stored, envService.outputDateFormat).toDate(),
      o.content && SerializedCmsContent.fromObject(o.content, envService)
    );

  }

  /**
   * Create a CmsContent object from the given UserContent object.
   * @param userContent user content to convert.
   * @param envService env vars for date deserialization are needed
   * @returns new CmsContent object with history id from the given user content.
   *          if user content is falsy, an empty CmsContent without history id is returned.
   */
  public static fromUserContent(userContent: UserContent, envService: EnvironmentService): CmsContent {

    if (!userContent) {
      return new CmsContent();
    }

    const cmsContent = JSON.parse(userContent.content);

    return new CmsContent(
      userContent.id, // TODO check if swapping hist_id <-> id is okay here
      userContent.previousId,
      userContent.nextId,
      cmsContent.saved && moment.utc(cmsContent.saved, envService.outputDateFormat).toDate(),
      cmsContent.sent && moment.utc(cmsContent.sent, envService.outputDateFormat).toDate(),
      userContent.saveDate && moment.utc(userContent.saveDate, envService.outputDateFormat).toDate(),
      cmsContent && SerializedCmsContent.fromObject(cmsContent.content, envService)
    );

  }

}
