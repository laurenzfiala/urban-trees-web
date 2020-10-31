import {CmsComponent} from '../interfaces/cms-component.interface';

/**
 * Wraps around an object and makes it replaceable even if its immutable.
 *
 * @author Laurenz Fiala
 * @since 2020/10/15
 */
export class MutableWrapper<T> {

  /**
   * The mutable object to hold.
   */
  public value: T;

  constructor(value?: T) {
    this.value = value;
  }

  public get(): T {
    return this.value;
  }

  public set(value: T): void {
    this.value = value;
  }

}
