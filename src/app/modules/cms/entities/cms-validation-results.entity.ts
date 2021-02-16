/**
 * Holds all validation results from one validation
 * pass inside a CMS content.
 *
 * @author Laurenz Fiala
 * @since 2021/02/11
 */
import {CmsValidationResult} from './cms-validation-result.entity';

export class CmsValidationResults {

  private _results: Array<CmsValidationResult>;

  constructor() {
    this._results = new Array<CmsValidationResult>();
  }

  /**
   * Add a result to the list of validation results.
   * @param result non-null CmsValidationResult
   * @returns the just-added result
   */
  public addResult(result: CmsValidationResult): CmsValidationResult {
    this._results.push(result);
    return result;
  }

  /**
   * Returns true if any of the CmsValidationResults in #results
   * is an error. If not, this method returns false.
   */
  public hasErrors(): boolean {
    return this._results.find(value => value.isError) !== undefined;
  }

  /**
   * Returns a copy of stored validation results.
   */
  public results(): Array<CmsValidationResult> {
    return this._results.slice();
  }

}
