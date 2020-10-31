import {BeaconFrontend} from '../../trees/entities/beacon-frontend.entity';
import {SerializedCmsComponent} from './serialized-cms-component.entity';

/**
 * Holds meta-information on the content
 * and the serialized components within.
 */
export class Content {

  private versionCode: number;
  private components: Array<SerializedCmsComponent>;

  constructor(versionCode: number,
              components: Array<SerializedCmsComponent>) {
    this.versionCode = versionCode;
    this.components = components;
  }

  public getComponents(): Array<SerializedCmsComponent> {
    return this.components;
  }

  public setComponents(components: Array<SerializedCmsComponent>): void {
    this.components = components;
  }

  public static fromObject(o: any): Content {

    if (!o) {
      return null;
    }

    return new Content(
      o.versionCode,
      o.components && o.components.map(c => SerializedCmsComponent.fromObject(c))
    );

  }

}
