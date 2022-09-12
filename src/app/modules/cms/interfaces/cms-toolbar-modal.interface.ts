import {TemplateRef} from '@angular/core';

/**
 * Holds info for showing/hiding of modals
 * on the CMS toolbar.
 */
export interface CmsToolbarModal {

  template: TemplateRef<any>;
  show: boolean;
  arrowPos?: string;

}
