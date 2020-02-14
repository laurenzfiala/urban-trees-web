/**
 * This abstract component class provides status functionality
 * to be used to track progress using enums or numbers.
 *
 * @author Laurenz Fiala
 * @since 2018/04/23
 */
import {ApiError} from '../entities/api-error.entity';
import {Observable, Subject} from 'rxjs';
import {EventEmitter} from '@angular/core';

export abstract class AbstractStatusComponent {

  /**
   * Contains all current statuses of the component.
   * @type {Map<number, number>} key and value should be from two different enums.
   *                             The key Should be the category and the value the current status of it.
   *                             The value can also be a numeric progress value.
   * TODO redo doc
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
   * Optionally with an ApiError.
   */
  protected setStatus(key: number, value: number, error?: ApiError) {
    this.statuses.set(key, [value, error]);
    const sub = this.statusObservers.get(key);
    if (sub !== undefined) {
      sub.next(value);
    }
    if (error !== undefined) {
      const subErr = this.statusErrorObservers.get(key);
      if (subErr !== undefined) {
        subErr.next(error);
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
      sub = new Subject<number>();
      this.statusObservers.set(key, sub);
    }
    sub.next(this.getStatus(key));
    return sub.asObservable();
  }

  /**
   * Get the error associated with the status
   * with given id.
   * @param {number} key category id
   * @returns {ApiError} associated error or null
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
  public getStatusErrorObservable(key: number): Observable<number> {
    let sub;
    if (this.statusErrorObservers.has(key)) {
      sub = this.statusErrorObservers.get(key);
    } else {
      sub = new Subject<ApiError>();
      this.statusErrorObservers.set(key, sub);
    }
    sub.next(this.getStatusError(key));
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
