import {Type} from '@angular/core';

/**
 * TODO
 *
 * @author Laurenz Fiala
 * @since 2020/09/30
 */
export class CmsContentConfig {

  private _layouts: Array<CmsLayoutConfig>;
  private _components: Array<CmsComponentConfig>;
  private _showToolbar: boolean;

  constructor(layouts: Array<CmsLayoutConfig>,
              components: Array<CmsComponentConfig>,
              showToolbar: boolean = true) {
    this._layouts = layouts;
    this._components = components;
    this._showToolbar = showToolbar;
  }


  get layouts(): Array<CmsLayoutConfig> {
    return this._layouts;
  }

  get components(): Array<CmsComponentConfig> {
    return this._components;
  }

  get showToolbar(): boolean {
    return this._showToolbar;
  }
}

export class CmsLayoutConfig {

  private _layout: Type<unknown>;
  private _slotConfig: Array<CmsLayoutSlotConfig> = new Array<CmsLayoutSlotConfig>();

  constructor(layout: Type<unknown>, slotConfig: Array<CmsLayoutSlotConfig>) {
    this._layout = layout;
    this._slotConfig = slotConfig;
  }


  get layout(): Type<unknown> {
    return this._layout;
  }

  get slotConfig(): Array<CmsLayoutSlotConfig> {
    return this._slotConfig;
  }
}

export class CmsComponentConfig {

  private _component: Type<unknown>;

  constructor(component: Type<unknown>) {
    this._component = component;
  }

  get component(): Type<unknown> {
    return this._component;
  }
}

/**
 * Configures which components may be set to which slots.
 *
 * @author Laurenz Fiala
 * @since 2020/10/03
 */
export class CmsLayoutSlotConfig {

  /**
   * Name of the slot to configure.
   * Names of supported slots in a layout can be can be retrieved
   * at compile-time by static field <YOUR_LAYOUT>#SLOTS.
   */
  public slot: string;

  /**
   * Defines which components are allowed in the given defined #slot.
   * If 'all' is given, all components may be set to that slot.
   */
  public allowedComponents: Array<Type<unknown>> | 'all';

  /**
   * Name of the slot to configure.
   * @param slot Name of the slot to configure.
   * @param allowedComponents Allowed components in the given slot or 'all'.
   */
  constructor(slot: string, allowedComponents: Array<Type<unknown>> | 'all') {
    this.slot = slot;
    this.allowedComponents = allowedComponents;
  }

}
