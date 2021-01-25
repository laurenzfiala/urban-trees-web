/**
 * Holds meta-information on a single content-element (layout/component)
 * and its serialized data/content.
 */
export class SerializedCmsElement {

  /**
   * Name of the element.
   * @see CmsElement#getName()
   */
  private readonly name: string;

  /**
   * Element's content-data; previously
   * serialized by that element.
   */
  private readonly data: any;

  constructor(name: string,
              data: any) {
    this.name = name;
    this.data = data;
  }

  public getName(): string {
    return this.name;
  }

  public getData(): any {
    return this.data;
  }

  /**
   * Create a new instance from an untyped object.
   * @param o untyped object of correct shape.
   * @return instance of SerializedCmsElement with set members (if object-shape was correct);
   *         or null if object is falsy
   */
  public static fromObject(o: any): SerializedCmsElement {

    if (!o) {
      return null;
    }

    return new SerializedCmsElement(
      o.name,
      o.data
    );

  }

}
