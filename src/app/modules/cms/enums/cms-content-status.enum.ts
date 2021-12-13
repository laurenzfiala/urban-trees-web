/**
 * Declares CMS content statuses which tell
 * whether the content is published, draft, etc.
 *
 * @author Laurenz Fiala
 * @since 2020/12/11
 */
export enum ContentStatus {

  /**
   * Content was not yet published by the user and is saved as a draft.
   */
  DRAFT,

  /**
   * Content is being published and not yet visible to others.
   */
  PUBLISHING,

  /**
   * Content was successfully published and is visible to others.
   */
  PUBLISHED

  // TODO

}
