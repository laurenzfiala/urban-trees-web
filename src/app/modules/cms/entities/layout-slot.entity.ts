import {CmsComponent} from '../interfaces/cms-component.interface';

/**
 * A slot for a component inside
 * a CMS layout.
 *
 * @author Laurenz Fiala
 * @since 2020/10/03
 */
export class CmsLayoutSlot {

  /**
   * Name of slot.
   */
  private _name: string;

  /**
   * The component inside the slot.
   * Undefined if not filled.
   */
  public component: CmsComponent;

  constructor(name: string, component?: CmsComponent) {
    this._name = name;
    this.component = component;
  }

  get name() {
    return this._name;
  }

}
