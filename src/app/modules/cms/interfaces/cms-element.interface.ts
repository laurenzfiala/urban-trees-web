import {CmsValidationResult} from '../entities/cms-validation-result.entities';
import {EventEmitter} from '@angular/core';
import {Observable} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';

/**
 * Serves as the base interface for all CMS layouts and components.
 */
export interface CmsElement {

  /**
   * Apply the given serialized data to this
   * instance.
   * @param serialized the serialized object from #serialize.
   */
  deserialize(data: any): void;

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
   * For user-interaction, use CmsValidationResult#
   * @return validation results
   */
  validate(): Array<CmsValidationResult>;

  /**
   * The returned observable is triggered every time the element
   * changed.
   */
  onChanged(): Observable<CmsElement>;

}
