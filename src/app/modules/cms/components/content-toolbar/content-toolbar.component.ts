import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ToolbarBtn, ToolbarDropdown, ToolbarToggleBtn} from '../../entities/toolbar.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {Subscription} from 'rxjs';
import {ContentService} from '../../services/content.service';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';
import {CmsToolbarModal} from '../../interfaces/cms-toolbar-modal.interface';
import {TooltipDirective} from 'ngx-bootstrap/tooltip';

@Component({
  selector: 'ut-content-toolbar',
  templateUrl: './content-toolbar.component.html',
  styleUrls: ['./content-toolbar.component.less', './content-toolbar.shared.less']
})
export class ContentToolbarComponent implements OnInit, OnDestroy {

  ViewMode = ViewMode;
  public ToolbarBtn = ToolbarBtn;
  public ToolbarToggleBtn = ToolbarToggleBtn;
  public ToolbarDropdown = ToolbarDropdown;

  public modal: CmsToolbarModal | null;

  private onUpdateSub: Subscription;
  private onModalSub: Subscription;
  private onViewModeChangeSub: Subscription;
  private onElementDroppedSub: Subscription;

  @ViewChild('editToggleBtn', {read: TooltipDirective})
  private editToggleBtn: TooltipDirective;

  constructor(public toolbar: ToolbarService,
              public contentService: ContentService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onUpdateSub = this.toolbar.onUpdate.subscribe(value => {
      this.cdRef.detectChanges();
    });

    this.onModalSub = this.toolbar.onModal.subscribe(modal => {
      this.modal = modal;
      this.cdRef.detectChanges();
    });

    this.onViewModeChangeSub = this.contentService.onViewModeChange().subscribe(value => {
      if (!this.editToggleBtn) {
        return;
      }
      if (value !== ViewMode.EDIT_LAYOUT) {
        this.editToggleBtn.hide();
      }
      this.cdRef.detectChanges();
    });

    this.onElementDroppedSub = this.contentService.onElementDropped().subscribe(value => {
      this.editToggleBtn.show();
    });
  }

  ngOnDestroy() {
    this.onUpdateSub.unsubscribe();
    this.onModalSub.unsubscribe();
    this.onViewModeChangeSub.unsubscribe();
    this.onElementDroppedSub.unsubscribe();
  }

  public undo(): void {
    this.contentService.undo();
  }

  public redo(): void {
    this.contentService.undo(false);
  }

  public toggleViewMode(): void {
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
