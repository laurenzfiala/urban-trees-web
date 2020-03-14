/**
 * Image sent from backend including alt title and base64 encoded image data.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
export class Image {

  public id: number;
  public encodedImage: string;
  public alternativeText: string;

  constructor(
    id?: number,
    encodedImage?: string,
    alternativeText?: string
  ) {
    this.id = id;
    this.encodedImage = encodedImage;
    this.alternativeText = alternativeText;
  }

  public static fromObject(o: any): Image {

    return new Image(
      o.id,
      o.encodedImage,
      o.alternativeText
    );

  }

}
