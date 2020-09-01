import {Type} from '@angular/core';
import {TextComponent} from '../components/text/text.component';

/**
 * Holds meta-information on a single component
 * and its serialized data/content.
 */
export class SerializedCmsComponent {

  private name: string;
  private data: any;

  constructor(name: string,
              data: any) {
    this.name = name;
    this.data = data;
  }

  public getName(): string {
    return this.name;
  }

  public getData(): any {
    return this.data;
  }

  public static fromObject(o: any): SerializedCmsComponent {

    if (!o) {
      return null;
    }

    return new SerializedCmsComponent(
      o.name,
      o.data
    );

  }

}
