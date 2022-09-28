/**
 * Simple stack implementation.
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
   * Current position in the #elements-array.
   */
  private _stackPointer: number;

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
   * Amount of elements at the star tof the stack
   * protected from being removed by #pop().
   */
  private protectedSize: number;

  /**
   * Create a new stack, optionally with a maximum size.
   * @param maxSize if maxSize is exceeded, the oldest entries rotate out (are deleted).
   */
  constructor(maxSize: number = -1, protectedSize: number = 0) {
    this.elements = new Array<T>();
    this._stackPointer = 0;
    this._size = 0;
    this.maxSize = maxSize;
    this.protectedSize = protectedSize;
  }

  /**
   * Pushes the given elements to the
   * current stack pointer location. The last given
   * element is then the last entry in the stack
   * and the new stack position.
   * @param elements all elements to add to the stack
   */
  public push(...elements: Array<T>): void {
    if (this.maxSize >= 0) {
      const overflow = this._stackPointer + elements.length - this.maxSize;
      if (elements.length > this.maxSize) {
        elements = elements.slice(0, elements.length - this.maxSize);
        this._stackPointer = 0;
        this._size = 0;
      } else if (overflow > 0) {
        this.elements = this.elements.slice(overflow);
        this._size -= overflow;
      }
    }
    elements.forEach(value => {
      this.elements[this._stackPointer++] = value;
    });
    this.elements = this.elements.slice(0, this._stackPointer);
    this._size += elements.length;
  }

  /**
   * Returns the newest element from the stack.
   * If the stack is empty, returns undefined.
   * Does not move the stack pointer.
   * @param offset TODO
   */
  public peek(offset: number = 0): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.elements[this._stackPointer - 1 + offset];
  }

  /**
   * Returns the newest element from the stack and removes it.
   * If the stack is empty, returns undefined.
   * Also moves the stack pointer.
   * @param offset TODO
   */
  public pop(offset: number = 0): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const newPos = this._stackPointer + offset - 1;
    if (newPos < 0 || newPos > this._size) {
      return undefined;
    }
    if (newPos < this.protectedSize) {
      this._stackPointer = this.protectedSize;
    } else {
      this._stackPointer = newPos;
    }
    return this.elements[newPos - 1];
  }

  /**
   * Find and return a matching element. Search starts with #peek()
   * and looks though the stack from newest to oldest elements.
   * @param test testing function: return true to match the given element; false to look further.
   * @param (default false) true to search from oldest to newest entry
   * @return T or null if no element matched.
   */
  public find(test: (element: T) => (boolean), reverse: boolean = false): T {

    let elements = this.elements;
    if (reverse) {
      elements = this.elements.reverse();
    }

    for (let i = this._stackPointer - 1; i >= 0; i--) {
      const el = elements[i];
      if (test(el)) {
        return el;
      }
    }
    return null;

  }

  /**
   * TODO
   */
  public newerEntriesAmount(): number {
    return this._size - this._stackPointer;
  }

  public size(): number {
    return this._size;
  }

  public isEmpty(): boolean {
    return this._size === 0;
  }

}
