/**
 * Declares CMS element types so it can be
 * determined whether the elementis a component
 * or a layout.
 *
 * @author Laurenz Fiala
 * @since 2020/10/15
 */
export enum ElementType {

  /**
   * Signifies that the element is a CmsComponent.
   */
  COMPONENT,

  /**
   * Signifies that the element is a CmsLayout.
   */
  LAYOUT

}
