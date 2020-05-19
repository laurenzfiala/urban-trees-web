import {CmsComponent} from '../interfaces/cms-component.inerface';

/**
 * Holds meta-information on the content
 * and the serialized components within.
 */
export class Content {

  private versionCode: number;
  private components: Array<CmsComponent>;

  constructor(versionCode: number) {
    this.versionCode = versionCode;
  }

  public setComponents(components: Array<CmsComponent>): void {
    this.components = components;
  }

}
