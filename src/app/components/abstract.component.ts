/**
 * This abstract component class provides helpful functionality
 * useful to all components of the app.
 * @author Laurenz Fiala
 * @since 2018/02/17
 */
export abstract class AbstractComponent {

  /**
   * Contains all current statuses of the component.
   * @type {Map<number, number>} key and value should be from two different enums.
   *                             The key Should be the category and the value the current status of it.
   *                             The value can also be a numeric progress value.
   */
  private statuses: Map<number, number> = new Map<number, number>();

  /**
   * Set the status of the given category.
   */
  protected setStatus(key: number, value: number) {
    this.statuses.set(key, value);
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
    return this.statuses.get(key);
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
    if (status !== undefined && status === value) {
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

}
