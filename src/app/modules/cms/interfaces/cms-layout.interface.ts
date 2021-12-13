/**
 * Serves as the base interface for all CMS layouts.
 */
import {CmsElement} from './cms-element.interface';

export interface CmsLayout extends CmsElement {

  /**
   * TODO
   * @param element
   */
  onElementAdd(element: CmsElement): void;

  /**
   * TODO
   * @param element
   */
  onElementRemove(element: CmsElement): void;

}


