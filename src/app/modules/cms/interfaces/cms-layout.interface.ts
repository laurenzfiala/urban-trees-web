/**
 * Serves as the base interface for all CMS components.
 */
import {CmsComponent} from './cms-component.interface';
import {CmsElement} from './cms-element.interface';

export interface CmsLayout extends CmsElement {

  /**
   * TODO
   * @param component
   */
  onElementAdd(component: CmsComponent): void;

  /**
   * TODO
   * @param component
   */
  onElementRemove(component: CmsComponent): void;

}


