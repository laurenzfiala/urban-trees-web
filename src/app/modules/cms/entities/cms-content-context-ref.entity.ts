/**
 * Holds meta-information a backend CMS content entry.
 */
import {UserContentMetadata} from './user-content-metadata.entity';

export class CmsContentContextRef<T> {

  public readonly contentId: string;
  public readonly typeComponent: string;
  public readonly idComponent: string;
  public context: T;
  private _metadata: UserContentMetadata;

  get metadata() {
    return this._metadata;
  }

  constructor(contentId: string,
              typeComponent: string,
              idComponent: string) {
    this.contentId = contentId;
    this.typeComponent = typeComponent;
    this.idComponent = idComponent;
  }

  /**
   * TODO
   */
  public for(metadata: UserContentMetadata): CmsContentContextRef<T> {
    this._metadata = metadata;
    return this;
  }

  public static fromContentId(contentId: string): CmsContentContextRef<any> {

    if (!contentId) {
      return null;
    }

    let separatorIndex = contentId.indexOf('-');
    if (separatorIndex === -1) {
      separatorIndex = contentId.length;
    }
    let typeComponent = contentId.substring(0, separatorIndex);
    let idComponent = contentId.substring(separatorIndex + 1);

    return new CmsContentContextRef(
      contentId,
      typeComponent,
      idComponent
    );

  }

}
