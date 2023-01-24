/**
 * Holds all validation results from one validation
 * pass inside a CMS content.
 *
 * @author Laurenz Fiala
 * @since 2021/02/11
 */
import {CmsValidationResult} from './cms-validation-result.entity';
import {Observable} from 'rxjs';
import {Async2Pipe} from '../../shared/pipes/async2.pipe';
import {TranslateService} from '@ngx-translate/core';

export class CmsValidationResults {

  private _results: Array<CmsValidationResult>;

  constructor() {
    this.reset();
  }

  /**
   * Delete all results from this instance.
   * @returns self
   */
  public reset(): CmsValidationResults {
    this._results = new Array<CmsValidationResult>();
    return this;
  }

  /**
   * Add a result to the list of validation results.
   * @param result non-null CmsValidationResult
   * @returns self
   */
  public addResult(result: CmsValidationResult): CmsValidationResults {
    this._results.push(result);
    return this;
  }

  /**
   * Returns true if any of the CmsValidationResults in #results
   * is an error. If not, this method returns false.
   */
  public hasErrors(): boolean {
    return this._results.find(r => r.isError) !== undefined;
  }

  /**
   * Returns true if any of the results
   * is marked highlighted.
   */
  public hasHighlighted(): boolean {
    return this._results.filter(r => r.isHighlighted).length > 0;
  }

  /**
   * Mark the results to be shown in the UI.
   */
  public highlight(): void {
    this._results.forEach(r => r.highlight());
  }

  /**
   * Get all results that are marked highlighted.
   */
  public highlighted(): Array<CmsValidationResult> {
    return this._results.filter(r => r.isHighlighted);
  }

  /**
   * Returns a copy of stored validation results.
   */
  public results(): Array<CmsValidationResult> {
    return this._results.slice();
  }

  /**
   * Generates a string from all error messages.
   */
  public async errorString(): Promise<string | null> {
    const promises = this._results.map(r => {
      if (r.message instanceof Observable<string>) {
        return (r.message as Observable<string>).toPromise();
      }
      return Promise.resolve(r.message as string);
    });
    return (await Promise.all(promises)).join('\n');
  }

}
