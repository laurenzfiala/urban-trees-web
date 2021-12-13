import {Observable} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {CmsValidationResults} from '../entities/cms-validation-results.entity';

/**
 * Serves as the base interface for all CMS layouts and components.
 */
export interface CmsElement {

  /**
   * Apply the given serialized data to this
   * instance.
   * @param serialized the serialized object from #serialize.
   */
  deserialize(data: any): Promise<void>;

  /**
   * Serializes the current CMS element to an object
   * for persistence.
   * The resulting object should be stored in the #data field of the enclosing object.
   */
  serialize(): any;

  /**
   * Return the name of this element.
   */
  getName(): string;

  /**
   * Return the element type of this element.
   * @see ElementType
   */
  getElementType(): ElementType;

  /**
   * Check validity of the element (and its children).
   * This does not trigger any visual output by the corresponding elements.
   * For user-interaction, use CmsValidationResult#highlight().
   * @param results use this to add more results
   */
  validate(results: CmsValidationResults): void;

  /**
   * The returned observable is triggered every time the element
   * changed.
   */
  onChanged(): Observable<CmsElement>;

  /**
   * The parent element(s) call this so the element
   * can register itself with them to receive updates.
   * This is especially needed, when a child has CdStrat.OnPush
   * and needs an input event to update.
   */
  addUpdater(observable: Observable<CmsElement>): void;

}
