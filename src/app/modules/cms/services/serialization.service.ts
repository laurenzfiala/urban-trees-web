import {Injectable} from '@angular/core';
import {SerializedCmsContent} from '../entities/serialized-cms-content.entity';
import {CmsElement} from '../interfaces/cms-element.interface';
import {SerializedCmsElement} from '../entities/serialized-cms-element.entity';

/**
 * Handles serialization and deserialization of cms content
 * and provides utility functions for the cms components to (de-)serialize
 * their content.
 * @author Lautrenz Fiala
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
      serializedElements.push(new SerializedCmsElement(element.getName(), this.serializeElement(element)));
    });

    return serializedElements;

  }

  /**
   * TODO
   * @param serializedElement
   */
  public deserializeElement(untypedSerializedElement: any): SerializedCmsElement {
    return SerializedCmsElement.fromObject(untypedSerializedElement);
  }

  /**
   * TODO
   * @param serializedElements
   */
  public serializeContent(...serializedElements: Array<CmsElement>): SerializedCmsContent {
    return new SerializedCmsContent(
      SerializationService.VERSION_CODE,
      undefined, // TODO
      undefined, // TODO
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
