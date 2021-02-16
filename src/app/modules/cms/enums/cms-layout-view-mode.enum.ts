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
   * Hide the content so layout bounds can be seen.
   * This is used for e.g. a new component.
   */
  EDIT_LAYOUT

}
