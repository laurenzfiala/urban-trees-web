import {CmsLayout} from '../interfaces/cms-layout.interface';
import {CmsComponent} from '../interfaces/cms-component.interface';
import {Type} from '@angular/core';

/**
 * TODO
 *
 * @author Laurenz Fiala
 * @since 2020/09/30
 */
export class CmsContentConfig {

  private layouts: Array<CmsLayoutConfig>;
  private components: Array<CmsComponentConfig>;

  constructor(layouts: Array<CmsLayoutConfig>, components: Array<CmsComponentConfig>) {
    this.layouts = layouts;
    this.components = components;
  }

}

export class CmsLayoutConfig {

  private layout: Type<unknown>;
  private slotConfig: Array<CmsLayoutSlotConfig> = new Array<CmsLayoutSlotConfig>();

  constructor(layout: Type<unknown>, slotConfig: Array<CmsLayoutSlotConfig>) {
    this.layout = layout;
    this.slotConfig = slotConfig;
  }

}

export class CmsComponentConfig {

  private component: Type<unknown>;

  constructor(component: Type<unknown>) {
    this.component = component;
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
