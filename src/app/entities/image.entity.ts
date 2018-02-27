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

}
