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
   * The Date at which this object was generated.
   */
  public saved: Date;

  /**
   * The Date at which this object was persisted on the backend.
   */
  public stored: Date;

  /**
   * Contents.
   */
  public readonly elements: Array<SerializedCmsElement>;

  constructor(version: number,
              saved: Date,
              stored: Date,
              elements: Array<SerializedCmsElement>) {
    this.version = version;
    this.saved = saved;
    this.stored = stored;
    this.elements = elements;
  }

  public isSaved(): boolean {
    return this.saved !== undefined;
  }

  public isStored(): boolean {
    return this.stored !== undefined;
  }

  /**
   * Crete a new instance from an untyped object.
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
      o.stored && moment.utc(o.stored, envService.outputDateFormat).toDate(),
      (o.elements as Array<SerializedCmsElement>).map(e => SerializedCmsElement.fromObject(e))
    );

  }

}
