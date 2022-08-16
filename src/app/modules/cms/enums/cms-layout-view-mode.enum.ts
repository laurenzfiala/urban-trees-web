/**
 * Declares all available view modes
 * for CMS content elements.
 */
export enum ViewMode {

  /**
   * Show the content.
   * This is used when viewing content.
   */
  CONTENT,

  /**
   * Show the content so it can be edited.
   */
  EDIT_CONTENT,

  /**
   * Show layout bounds and layout editiing buttons.
   * This is used for e.g. a new component.
   */
  EDIT_LAYOUT,

  /**
   * Show drop targets while a component is selected/dragged for insertion.
   */
  INSERT_ELEMENT

}
