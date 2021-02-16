import {SerializedCmsElement} from './serialized-cms-element.entity';
import {EnvironmentService} from '../../shared/services/environment.service';

/**
 * Holds meta-information on all content-elements (layout/component)
 * and its serialized data inside a cms-content-component.
 */
export class SerializedCmsContent {

  /**
   * The serialization service version which
   * was used to generate this object.
   */
  public readonly version: number;

  /**
   * Contents.
   */
  public readonly elements: Array<SerializedCmsElement>;

  constructor(version: number,
              elements: Array<SerializedCmsElement>) {
    this.version = version;
    this.elements = elements;
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
      (o.elements as Array<SerializedCmsElement>).map(e => SerializedCmsElement.fromObject(e))
    );

  }

}
