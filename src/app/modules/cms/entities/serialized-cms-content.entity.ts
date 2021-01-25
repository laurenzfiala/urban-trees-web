/**
 * Holds meta-information on all content-elements (layout/component)
 * and its serialized data inside a cms-content-component.
 */
import {SerializedCmsElement} from './serialized-cms-element.entity';
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';

export class SerializedCmsContent {

  /**
   * The serialization service version which
   * was used to generate this object.
   */
  public readonly version: number;

  /**
   * UID of the user content that proceeded this one (may be null/undefined if first entry).
   */
  public readonly historyId: number;

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
   * Contents.
   */
  public readonly elements: Array<SerializedCmsElement>;

  constructor(version: number,
              saved: Date,
              elements: Array<SerializedCmsElement>) {
    this.version = version;
    this.saved = saved;
    this.elements = elements;
  }

  public isSaved(): boolean {
    return this.saved !== undefined;
  }

  public isSent(): boolean {
    return this.sent !== undefined;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of SerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): SerializedCmsContent {

    if (!o || !o.elements) {
      return null;
    }

    return new SerializedCmsContent(
      o.version,
      o.saved && moment.utc(o.saved, envService.outputDateFormat).toDate(),
      (o.elements as Array<SerializedCmsElement>).map(e => SerializedCmsElement.fromObject(e))
    );

  }

}
