/**
 * All possible states a UserContent can have.
 *
 * @author Laurenz Fiala
 * @since 2021/07/31
 */
export enum UserContentStatus {

  // --- Permanent statuses ---
  /**
   * The user content may only be seen/edited by the user who created
   * the draft. Admins/approvers may also not view this content.
   */
  DRAFT = 'DRAFT',

  /**
   * The user content was approved by an approver and may be viewed by
   * users with viewing permissions.
   */
  APPROVED = 'APPROVED',

  /**
   * The user content is deleted and is not depended on by other current
   * user content.
   */
  DELETED = 'DELETED',

  // --- Transient statuses ---
  /**
   * The user content was published by the creator and awaits approval
   * by an approver for this content id.
   */
  DRAFT_AWAITING_APPROVAL = 'DRAFT_AWAITING_APPROVAL',

  /**
   * An editing user wants to delete a user content, but it is not yet
   * deleted by an approver. The content was previously approved.
   */
  APPROVED_AWAITING_DELETION = 'APPROVED_AWAITING_DELETION',

  /**
   * An editing user wants to delete a user content, but it is not yet
   * deleted by an approver. The content was previously NOT approved.
   */
  DRAFT_AWAITING_DELETION = 'DRAFT_AWAITING_DELETION',

}

/**
 * Static helpers for UserContentStatus.
 */
export class UserContentStatusHelper {

  /**
   * TODO
   * @param status
   */
  public static isPermanent(status: UserContentStatus): boolean {
    return [
      UserContentStatus.DRAFT,
      UserContentStatus.APPROVED,
      UserContentStatus.DELETED].indexOf(status) > -1;
  }

  /**
   * TODO
   * @param status
   */
  public static isTransient(status: UserContentStatus): boolean {
    return !UserContentStatusHelper.isPermanent(status);
  }

}
