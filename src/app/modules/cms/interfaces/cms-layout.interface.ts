/**
 * Serves as the base interface for all CMS components.
 */
import {ToolbarBtn, ToolbarElement, ToolbarSection} from '../entities/toolbar.entity';

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

  /**
   * Returns the main toolbar buttons that can be used to create new instance(s)
   * of the component and are shown in the toolbar.
   */
  getToolbarSection(): ToolbarSection<ToolbarBtn>;

  /**
   * Return the current contextual toolbar section for this component.
   * This is only displayed when the given component is focused, and updated
   * only when the component emits its changed event (TODO).
   */
  getToolbarContextual(): ToolbarSection<ToolbarElement>;

}
