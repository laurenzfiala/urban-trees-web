import { Injectable } from '@angular/core';
import {Content} from '../entities/content.entity';
import {CmsComponent} from '../interfaces/cms-component.inerface';

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

  public serializeContent(components: Array<CmsComponent>): string {
    const serializedComponents: Array<string> = new Array<string>();
    components.forEach(component => serializedComponents.push(component.serialize()));

    const content: Content = new Content(SerializationService.VERSION_CODE);
    content.setComponents(components);

    return JSON.stringify(content);
  }

  public deserializeContent(serialized: string): Content {
    const content: Content = JSON.parse(serialized);
    this.upgradeContent(content);

    return content;
  }

  /**
   * Upgrades the given content to the newest version code (#VERSION_CODE).
   * Operates on the given object.
   */
  private upgradeContent(givenContent: Content): void {
  }

  public serializeComponentState(object: any): any {
    return JSON.stringify(object);
  }

  public deserializeComponentState(serialized: string): any {
    return JSON.parse(serialized);
  }

}
