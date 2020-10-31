/**
 * Serves as the base interface for all CMS components.
 */
import {ToolbarElement, ToolbarSection} from '../entities/toolbar.entity';
import {CmsElement} from './cms-element.interface';
import {Observable} from 'rxjs';

export interface CmsComponent extends CmsElement {

  /**
   * Return the current contextual toolbar section for this component.
   * This is only displayed when the given component is focused, and updated
   * only when the component emits its changed event (TODO).
   */
  getToolbarContextual(): ToolbarSection<ToolbarElement>;

  /**
   * The returned observable is triggered every time
   * the component was focussed.
   */
  onFocus(): Observable<CmsComponent>;

  /**
   * The returned observable is triggered every time
   * the component lost focus.
   */
  onFocusOut(): Observable<CmsComponent>;

}
