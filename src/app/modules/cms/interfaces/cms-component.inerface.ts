/**
 * Serves as the base interface for all CMS components.
 */
export interface CmsComponent {

  /**
   * Apply the given serialized data to this
   * component-instance.
   * @param serialized the serialized string from #serialize.
   */
  deserialize(serialized: string): void;

  /**
   * Serializes the current CMS component to a string
   * for persistence.
   */
  serialize(): string;

}
