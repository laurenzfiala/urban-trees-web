import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ToolbarBtn, ToolbarDropdown} from '../../entities/toolbar.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {Subscription} from 'rxjs';
import {ContentService} from '../../services/content.service';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';

@Component({
  selector: 'ut-content-toolbar',
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.less', './content-toolbar.shared.less']
})
export class ContentToolbarComponent implements OnInit, OnDestroy {

  ViewMode = ViewMode;
  public ToolbarDropdown = ToolbarDropdown;
  public ToolbarBtn = ToolbarBtn;

  private onUpdateSub: Subscription;

  constructor(public toolbar: ToolbarService,
              public contentService: ContentService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onUpdateSub = this.toolbar.onUpdate.subscribe(value => {
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.onUpdateSub.unsubscribe();
  }

  public doBtnAction(btn: ToolbarBtn): void {
    btn.action();
  }

  public undo(): void {
    this.contentService.undo();
  }

  public redo(): void {
    this.contentService.undo(false);
  }

  public editLayout(): void {
    if (this.contentService.viewMode === ViewMode.EDIT_LAYOUT
        || this.contentService.viewMode === ViewMode.INSERT_ELEMENT) {
      this.contentService.viewMode = ViewMode.EDIT_CONTENT;
    } else {
      this.contentService.viewMode = ViewMode.EDIT_LAYOUT;
      this.toolbar.reset();
    }
  }

  get viewMode(): ViewMode {
    return this.contentService.viewMode;
  }

  /**
   * Returns true if the service signals that this
   * component should display itself in ANY of the
   * given view modes.
   * @param modes view modes: if ANY of these match, return true
   */
  public hasViewMode(...modes: ViewMode[]): boolean {
    return modes.includes(this.contentService.viewMode);
  }

}
