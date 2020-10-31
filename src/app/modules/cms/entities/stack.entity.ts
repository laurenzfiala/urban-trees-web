/**
 * Simple stack impelementation.
 *
 * @author Laurenz Fiala
 * @since 2020/10/29
 */
export class Stack<T> {

  /**
   * Elements for internal use are sotred in this array.
   */
  private elements: Array<T>;

  /**
   * Current size of the stack.
   */
  private _size: number;

  /**
   * Maximum size of this stack.
   * If maxSize is exceeded, the oldest entries rotate out (are deleted).
   * -1 => no limit.
   */
  private maxSize: number;

  /**
   * Create a new stack, optionally with a maximum size.
   * @param maxSize if maxSize is exceeded, the oldest entries rotate out (are deleted).
   */
  constructor(maxSize: number = -1) {
    this.elements = new Array<T>();
    this._size = 0;
    this.maxSize = maxSize;
  }

  /**
   * Returns the newest element from the stack.
   * If the stack is empty, returns undefined.
   */
  public push(...elements: Array<T>): void {
    if (this.maxSize >= 0) {
      const overflow = this._size + elements.length - this.maxSize;
      if (overflow > 0) {
        this.elements = this.elements.slice(overflow);
        this._size -= overflow;
      }
    }
    this.elements.push(...elements);
    this._size += elements.length;
  }

  /**
   * Returns the newest element from the stack.
   * If the stack is empty, returns undefined.
   */
  public peek(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.elements[this._size - 1];
  }

  /**
   * Returns the newest element from the stack and removes it.
   * If the stack is empty, returns undefined.
   */
  public pop(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.elements[--this._size];
  }

  /**
   * Find and return a matching element. Search starts with #peek()
   * and looks though the stack from newest to oldest elements.
   * @param test testing function: return true to match the given element; false to look further.
   * @return T or null if no element matched.
   */
  public find(test: (element: T) => (boolean)): T {

    for (let i = this._size - 1; i >= 0; i--) {
      const el = this.elements[i];
      if (test(el)) {
        return el;
      }
    }
    return null;

  }

  public size(): number {
    return this._size;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

}
