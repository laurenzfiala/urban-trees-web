/**
 * Single validation result form a CmsElement.
 *
 * @author Laurenz Fiala
 * @since 2021/02/11
 */
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

export class CmsValidationResult {

  public readonly isError: boolean;
  public readonly message: string;
  private _highlight: Subject<void>; // TODO check: THIS MUST ALWAYS BE COMPLETED TO AVOID MEM LEAKS!!

  constructor(isError: boolean, message: string) {
    this.isError = isError;
    this.message = message;
    this._highlight = new Subject<void>();
  }

  public highlight(): void {
    this._highlight.next();
  }

  public onHighlight(): Observable<void> {
    return this._highlight.asObservable();
  }

}
