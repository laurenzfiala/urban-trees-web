import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {UserContentManagerAccess} from '../../entities/user-content-manager-access.entity';
import {ContentManagerService} from '../../services/content-manager.service';
import {UserContent} from '../../entities/user-content.entity';
import {CmsContentConfig, CmsLayoutConfig, CmsLayoutSlotConfig} from '../../entities/content-config.entity';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';
import {CmsContent} from '../../entities/cms-content.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {UserContentMetadata} from '../../entities/user-content-metadata.entity';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {UserContentStatus} from '../../entities/user-content-status.entity';
import {ExpDaysLayout} from '../../cms-layouts/exp-days/exp-days.component';
import {UserService} from '../../../trees/services/user.service';

@Component({
  selector: 'ut-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.less']
})
export class ContentManagerComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public UserContentStatus = UserContentStatus;
  public ContentManagerMode = ContentManagerMode;

  public contentViewMode: ViewMode = ViewMode.CONTENT;
  public contentConfig: CmsContentConfig = new CmsContentConfig(
    [new CmsLayoutConfig(
      ExpDaysLayout,
      [
        new CmsLayoutSlotConfig(
          'all',
          []
        )
      ]
    )],
    [],
    false
  );

  public accessList: Array<UserContentManagerAccess>;
  public selectedAccess: UserContentManagerAccess;
  public accessSelectCollapsed: boolean = false;

  public contentList: Array<UserContentMetadata>;
  public selectedContentIndex: number;
  public loadContentHeightPx: number = 0;
  public selectedContent: UserContent;

  /**
   * Only show content for content access that matches the given expression.
   * The dropdown is not shown if this is set.
   * Only applied onInit().
   */
  @Input('accessPathExp')
  public accessPathExp: string;

  /**
   * Required!
   * Set the mode to either show viewable CMS items or approvable ones.
   * In view mode, entries can also only be viewed, not approved or denied.
   * Only applied onInit().
   */
  @Input('mode')
  public mode: ContentManagerMode;

  /**
   * If true, show content title (default), false to hide.
   */
  @Input('showTitle')
  public showTitle: boolean = true;

  /**
   * If true, show content status (default), false to hide.
   */
  @Input('showStatus')
  public showStatus: boolean = true;

  /**
   * If true, show path below access entry dropdown (default), false to hide.
   */
  @Input('showAccessDetails')
  public showAccessDetails: boolean = true;

  @ViewChild('contentContainer')
  public contentContainer: ElementRef;

  constructor(private managerService: ContentManagerService,
              private userService: UserService,
              private envService: EnvironmentService) {
    super();
  }

  ngOnInit(): void {
    if (this.mode === ContentManagerMode.VIEW) {
      this.loadViewableContentAccess();
    } else {
      this.loadApprovableContentAccess();
    }
  }

  public selectAccess(access: UserContentManagerAccess): void {
    this.selectedAccess = access;
    this.loadContentList();
  }

  public deleteContent(content: UserContentMetadata): void {
    // TODO
  }

  public denyContent(content: UserContentMetadata): void {
    this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.IN_PROGRESS);
    this.setStatus(StatusKey.DENY_CONTENT, StatusValue.IN_PROGRESS);
    this.managerService.denyContent(content.id, status => {
      content.status = status;
      this.selectedAccess.affectedContentAmount--;
      this.userService.getUserData().unapprovedContentAmount--;
      this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.SUCCESSFUL);
      this.setStatus(StatusKey.DENY_CONTENT, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.FAILED, apiError);
      this.setStatus(StatusKey.DENY_CONTENT, StatusValue.FAILED, apiError);
    });
  }

  public approveContent(content: UserContentMetadata): void {
    this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.IN_PROGRESS);
    this.setStatus(StatusKey.APPROVE_CONTENT, StatusValue.IN_PROGRESS);
    this.managerService.approveContent(content.id, status => {
      content.status = status;
      this.selectedAccess.affectedContentAmount--;
      this.userService.getUserData().unapprovedContentAmount--;
      this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.SUCCESSFUL);
      this.setStatus(StatusKey.APPROVE_CONTENT, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.FAILED, apiError);
      this.setStatus(StatusKey.APPROVE_CONTENT, StatusValue.FAILED, apiError);
    });
  }

  public loadViewableContentAccess(): void {
    this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.IN_PROGRESS);
    this.managerService.loadContentAccessViewable(this.accessPathExp, accesses => {
      this.accessList = accesses;
      this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.FAILED, apiError);
    });
  }

  public loadApprovableContentAccess(): void {
    this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.IN_PROGRESS);
    this.managerService.loadContentAccessApprovable(this.accessPathExp, accesses => {
      this.accessList = accesses;
      this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_ACCESS, StatusValue.FAILED, apiError);
    });
  }

  public loadContentList(): void {
    this.setStatus(StatusKey.LOAD_CONTENT_LIST, StatusValue.IN_PROGRESS);
    const success = content => {
      this.setStatus(StatusKey.LOAD_CONTENT_LIST, StatusValue.SUCCESSFUL);
      this.contentList = content;
      if (content.length > 0) {
        this.selectedContentIndex = 0;
        this.loadContent(this.contentList[this.selectedContentIndex]);
      }
    };
    const error = (e, apiError) => {
      this.setStatus(StatusKey.LOAD_CONTENT_LIST, StatusValue.FAILED, apiError);
    };
    if (this.mode === ContentManagerMode.VIEW) {
      this.managerService.loadContentViewable(this.selectedAccess.access, undefined, success, error);
    } else {
      this.managerService.loadContentApprovable(this.selectedAccess.access, undefined, success, error);
    }
  }

  public loadContent(meta: UserContentMetadata): void {
    this.setStatus(StatusKey.DENY_CONTENT, StatusValue.NONE);
    this.setStatus(StatusKey.APPROVE_CONTENT, StatusValue.NONE);
    this.setStatus(StatusKey.CONTENT_ACTION, StatusValue.NONE);
    this.setStatus(StatusKey.LOAD_CONTENT, StatusValue.IN_PROGRESS);
    this.managerService.loadContent(meta.id, content => {
      this.selectedContent = content;
      this.setStatus(StatusKey.LOAD_CONTENT, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_CONTENT, StatusValue.FAILED, apiError);
    });
  }

  get selectedContentMeta(): UserContentMetadata {
    if (!this.contentList || this.contentList.length === 0) {
      return null;
    }
    return this.contentList[this.selectedContentIndex];
  }

  public switchContent(offset: number): void {
    this.loadContentHeightPx = this.contentContainer.nativeElement.offsetHeight;
    this.selectedContentIndex += offset;
    this.loadContent(this.contentList[this.selectedContentIndex]);
  }

}

export enum StatusKey {

  LOAD_ACCESS,
  LOAD_CONTENT_LIST,
  LOAD_CONTENT,
  APPROVE_CONTENT,
  DENY_CONTENT,
  CONTENT_ACTION

}

export enum StatusValue {

  NONE,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}

/**
 * Used in input 'mode'.
 */
export enum ContentManagerMode {
  VIEW,
  APPROVE
}
