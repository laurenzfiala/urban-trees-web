/**
 * Holds meta-information of a backend CMS content entry.
 */
import {UserContentMetadata} from './user-content-metadata.entity';

export class CmsContentContextRef<T> {

  public readonly contentId: string;
  public readonly idComponent: string;
  public context: T;
  private _metadata: UserContentMetadata;

  get metadata() {
    return this._metadata;
  }

  constructor(contentId: string,
              idComponent: string) {
    this.contentId = contentId;
    this.idComponent = idComponent;
  }

  public for(metadata: UserContentMetadata): CmsContentContextRef<T> {
    this._metadata = metadata;
    return this;
  }

  public static fromContentId(idRegex: RegExp, contentId: string): CmsContentContextRef<any> {

    if (!contentId) {
      return null;
    }

    let matches = idRegex.exec(contentId);

    return new CmsContentContextRef(
      contentId,
      matches[1]
    );

  }

}
