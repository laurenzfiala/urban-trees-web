import {Injectable} from '@angular/core';
import {SerializedCmsContent} from '../entities/serialized-cms-content.entity';
import {CmsElement} from '../interfaces/cms-element.interface';
import {SerializedCmsElement} from '../entities/serialized-cms-element.entity';

/**
 * Handles serialization and deserialization of cms content
 * and provides utility functions for the cms components to (de-)serialize
 * their content.
 * @author Laurenz Fiala
 * @since 2020/05/17
 */
@Injectable({
  providedIn: 'root'
})
export class SerializationService {

  private static VERSION_CODE: number = 1;

  constructor() { }

  /**
   * Serializes the given CMS element(s), null-safe.
   * @param elements to serialize
   * @return serialized elements
   */
  public serializeElement(...elements: Array<CmsElement>): Array<SerializedCmsElement> {

    const serializedElements = new Array<SerializedCmsElement>();
    elements.forEach(element => {
      if (!element) {
        return;
      }
      serializedElements.push(new SerializedCmsElement(element.getName(), element.serialize()));
    });

    return serializedElements;

  }

  /**
   * Deserialize the given untyped CmsElement to a
   * SerializedCmsContent instance.
   * If the name is set, that object can later be
   * handed to the appropriate CmsElement.
   * @param serializedElement
   */
  public deserializeElement(untypedSerializedElement: any): SerializedCmsElement {
    return SerializedCmsElement.fromObject(untypedSerializedElement);
  }

  /**
   * Serialize all given CmsElements into a single SerializedCmsContent
   * object for submission to the backend.
   * @param serializedElements CmsElements retrieved through CmsElement#serialize()
   * @see #serializeElement(Array<CmsElement>)
   */
  public serializeContent(...serializedElements: Array<CmsElement>): SerializedCmsContent {
    return new SerializedCmsContent(
      SerializationService.VERSION_CODE,
      new Date(),
      this.serializeElement(...serializedElements)
    );
  }

  /**
   * Upgrades the given content to the newest version code (#VERSION_CODE).
   * Operates on the given object.
   */
  private upgradeContent(givenContent: SerializedCmsContent): void {
  }

}
