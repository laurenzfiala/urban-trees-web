/**
 * Holds a serialized CMS content entry including
 * data that is added by the backend (e.g. actual store date).
 * @see SerializedCmsContent
 */
import {SerializedCmsElement} from './serialized-cms-element.entity';
import * as moment from 'moment';
import {EnvironmentService} from '../../shared/services/environment.service';
import {SerializedCmsContent} from './serialized-cms-content.entity';

export class StoredSerializedCmsContent extends SerializedCmsContent {

  /**
   * The Date at which this object was persisted on the backend.
   */
  public stored: Date;

  constructor(content: SerializedCmsContent,
              stored: Date) {
    super(content.version, content.saved, content.elements);
    this.stored = stored;
  }

  public isStored(): boolean {
    return this.stored !== undefined;
  }

  /**
   * Crete a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @param envService env vars for date deserialization are needed
   * @return instance of StoredSerializedCmsContent with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any, envService: EnvironmentService): StoredSerializedCmsContent {

    if (!o || !o.elements) {
      return null;
    }

    return new StoredSerializedCmsContent(
      SerializedCmsContent.fromObject(o, envService),
      o.stored
    );

  }

}
