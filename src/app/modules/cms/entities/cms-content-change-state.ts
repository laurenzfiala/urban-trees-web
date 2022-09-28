/**
 * Holds all state values related to change tracking in ContentComponent.
 *
 * @author Laurenz Fiala
 * @since 2022/06/21
 */
import {Stack} from './stack.entity';
import {CmsContentChange} from './cms-content-change';
import {CmsContent} from './cms-content.entity';
import {UserContent} from './user-content.entity';

export class CmsContentChangeState {

  /**
   * Tracks the last 50 changes made by the user for undo/redo
   * actions and automatic saving.
   */
  public changes: Stack<CmsContentChange>;

  /**
   * If true, the last time content was saved, it was saved as a draft.
   * If false, the content was stored and published.
   */
  public isLastSaveDraft: boolean;

  /**
   * If true, the last time content was saved, it was saved as a draft.
   * If false, the content was stored and published.
   */
  public lastTrackedChange: Date;

  /**
   * Whether the displayed content has any untracked change not yet
   * reflected in #changes.
   */
  public hasUntrackedChange: boolean;

  /**
   * Amount of changes since the last save.
   */
  public unsavedChanges: number;

  constructor() {
    this.changes = new Stack<CmsContentChange>();
    this.lastTrackedChange = new Date(0);
    this.isLastSaveDraft = true;
    this.hasUntrackedChange = false;
    this.unsavedChanges = 0;
  }

  get lastSentContent(): CmsContentChange {
    return this.changes.find(c => c.isSent());
  }

  get lastSavedContent(): CmsContentChange {
    return this.changes.find(c => c.isSaved());
  }

  get lastStoredContent(): CmsContentChange {
    return this.changes.find(c => c.isStored());
  }

}
