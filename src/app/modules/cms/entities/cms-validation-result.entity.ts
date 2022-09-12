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
  public readonly message: string | Observable<string>;
  private _isHighlighted: boolean;
  private _highlightSubject: Subject<void>; // TODO check: THIS MUST ALWAYS BE COMPLETED TO AVOID MEM LEAKS!!

  constructor(isError: boolean,
              message: string | Observable<string>) {
    this.isError = isError;
    this.message = message;
    this._isHighlighted = false;
    this._highlightSubject = new Subject<void>();
  }

  get isHighlighted(): boolean {
    return this._isHighlighted;
  }

  public highlight(): void {
    this._isHighlighted = true;
    this._highlightSubject.next();
  }

  public onHighlight(): Observable<void> {
    return this._highlightSubject.asObservable();
  }

}
