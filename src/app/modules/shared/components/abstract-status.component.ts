/**
 * This abstract component class provides status functionality
 * to be used to track progress using enums or numbers.
 *
 * @author Laurenz Fiala
 * @since 2018/04/23
 */
import {ApiError} from '../entities/api-error.entity';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

export abstract class AbstractStatusComponent {

  /**
   * Contains all current statuses of the component.
   * @type {Map<number, any[]>} the key represents the status key and the value contains
   *                            two components: the status value and teh status error, if
   *                            applicable
   */
  private statuses: Map<number, any[]> = new Map<number, any[]>();

  /**
   * Holds all registered status observers that get notified whenever a status changes.
   */
  private statusObservers: Map<number, Subject<number>> = new Map<number, Subject<number>>();

  /**
   * Holds all registered status error observers that get notified whenever a status error changes.
   */
  private statusErrorObservers: Map<number, Subject<ApiError>> = new Map<number, Subject<ApiError>>();

  /**
   * Set the status of the given category.
   * Optionally with a context or ApiError.
   */
  protected setStatus(key: number, value: number, contextOrError?: any | ApiError) {
    this.statuses.set(key, [value, contextOrError]);
    this.getStatusObservable(key);
    const sub = this.statusObservers.get(key);
    if (sub !== undefined) {
      sub.next(value);
    }
    if (contextOrError !== undefined && contextOrError instanceof ApiError) {
      this.getStatusErrorObservable(key);
      const subErr = this.statusErrorObservers.get(key);
      if (subErr !== undefined) {
        subErr.next(contextOrError);
      }
    }
  }

  /**
   * Delete one category
   */
  protected deleteStatus(key: number) {
    this.statuses.delete(key);
  }

  /**
   * Get the value of a status category.
   * @param {number} key category id
   * @returns {boolean} the numeric status value
   */
  public getStatus(key: number): number {
    let status = this.statuses.get(key);
    if (status === undefined) {
      return undefined;
    }
    return status[0];
  }

  /**
   * Get status change observable.
   * @param {number} key category id
   * @returns {Observable<number>} observable called upon change
   */
  public getStatusObservable(key: number): Observable<number> {
    let sub;
    if (this.statusObservers.has(key)) {
      sub = this.statusObservers.get(key);
    } else {
      sub = new BehaviorSubject<number>(this.getStatus(key));
      this.statusObservers.set(key, sub);
    }
    return sub.asObservable();
  }

  /**
   * Get the context associated with the status
   * with given id.
   * @param {number} key category id
   * @returns any associated context (may also be an ApiError) or undefined
   */
  public getStatusContext(key: number): any {
    let status = this.statuses.get(key);
    if (status === undefined) {
      return undefined;
    }
    return status[1];
  }

  /**
   * Get the error associated with the status
   * with given id.
   * @param {number} key category id
   * @returns {ApiError} associated error or undefined
   */
  public getStatusError(key: number): ApiError {
    let status = this.statuses.get(key);
    if (status === undefined) {
      return undefined;
    }
    return status[1];
  }

  /**
   * Get status error change observable.
   * @param {number} key category id
   * @returns {Observable<ApiError>} observable called upon change
   */
  public getStatusErrorObservable(key: number): Observable<ApiError> {
    let sub;
    if (this.statusErrorObservers.has(key)) {
      sub = this.statusErrorObservers.get(key);
    } else {
      sub = new BehaviorSubject<ApiError>(this.getStatusError(key));
      this.statusErrorObservers.set(key, sub);
    }
    return sub.asObservable();
  }

  /**
   * Check whether the category exists.
   * @param {number} key category id
   * @returns {boolean} whether the given category exists or not
   */
  public hasStatusKey(key: number): boolean {
    return this.statuses.has(key);
  }

  /**
   * Whether the given status of the given category is currently active.
   * @param {number} key The status category key.
   * @param {number} value The status value.
   * @returns {boolean} whether the status exists
   */
  public hasStatus(key: number, value: number): boolean {
    let status = this.statuses.get(key);
    if (status === undefined) {
      return false;
    }
    if (status[0] === value) {
      return true;
    }
    return false;
  }

  /**
   * Whether any of the given statuses of the given category are
   * currently active.
   * @param {number} key The status category key.
   * @param {number} value The status value.
   * @returns {boolean} true if any of the given statuses exist; false otherwise
   */
  public hasAnyStatus(key: number, ...values: number[]): boolean {
    for (let v of values) {
      if (this.hasStatus(key, v)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Whether any of the given categories has the given key.
   * @param {number} keys The status categories keys.
   * @param {number} value The status value.
   * @returns {boolean} true if any of the given statuses exist; false otherwise
   */
  public hasAnyStatusKey(keys: number[], value: number): boolean {
    for (let k of keys) {
      if (this.hasStatus(k, value)) {
        return true;
      }
    }
    return false;
  }

}
