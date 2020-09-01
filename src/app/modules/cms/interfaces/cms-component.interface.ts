/**
 * Serves as the base interface for all CMS components.
 */
export interface CmsComponent {

  /**
   * Apply the given serialized data to this
   * component-instance.
   * @param serialized the serialized object from #serialize.
   */
  deserialize(serialized: any): void;

  /**
   * Serializes the current CMS component to an object
   * for persistence.
   */
  serialize(): any;

  /**
   * Return the name of this component.
   */
  getComponentName(): string;

}
