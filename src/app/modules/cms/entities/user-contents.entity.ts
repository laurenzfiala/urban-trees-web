/**
 * Holds a response for user content including the request parameters.
 */
import {UserContent} from './user-content.entity';

export class UserContents {

  public readonly contentPath: string;
  public readonly contentLang: string;
  public contents: Array<UserContent> = new Array<UserContent>();

  constructor(contentPath: string,
              contentLang: string,
              contents: Array<UserContent>) {
    this.contentPath = contentPath;
    this.contentLang = contentLang;
    this.contents = contents;
  }

  /**
   * If exactly one user content exists in the given UserContents-object
   * return it. If none exist, return an empty user content with path and language set.
   * If more than 1 user content exists, throw an error.
   * @param contents user contents
   */
  public static single(contents: UserContents): UserContent {
    if (contents.contents.length === 0) {
      return UserContent.create(contents.contentPath, contents.contentLang);
    } else if (contents.contents.length > 1) {
      throw new Error('Tried to get one user content from contents, but multiple were present.');
    }
    return contents.contents[0];
  }

}
