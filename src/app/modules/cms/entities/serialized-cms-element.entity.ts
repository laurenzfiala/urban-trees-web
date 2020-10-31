/**
 * Holds meta-information on a single content-element (layout/component)
 * and its serialized data/content.
 */
export class SerializedCmsContent {

  private name: string;
  private data: any;

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

  public static fromObject(o: any): SerializedCmsContent {

    if (!o) {
      return null;
    }

    return new SerializedCmsContent(
      o.name,
      o.data
    );

  }

}
