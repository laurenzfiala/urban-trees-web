/**
 * Serves as the base interface for all CMS components.
 */
import {CmsComponent} from './cms-component.interface';
import {CmsLayoutSlot} from '../entities/layout-slot.entity';
import {CmsElement} from './cms-element.interface';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';

export interface CmsLayout extends CmsElement {

  /**
   * Set the view mode this element should be in.
   * @param mode mode to display.
   */
  view(mode: ViewMode): void;

  /**
   * TODO
   * @param component
   */
  onElementAdd(slot: CmsLayoutSlot, component: CmsComponent): void;

  /**
   * TODO
   * @param component
   */
  onElementRemove(component: CmsComponent): void;

}


