/**
 * Serves as the base interface for all CMS layouts and components.
 */
export interface CmsElement {

  /**
   * Apply the given serialized data to this
   * instance.
   * @param serialized the serialized object from #serialize.
   */
  deserialize(serialized: any): void;

  /**
   * Serializes the current CMS element to an object
   * for persistence.
   */
  serialize(): any;

  /**
   * Return the name of this element.
   */
  getName(): string;

}
