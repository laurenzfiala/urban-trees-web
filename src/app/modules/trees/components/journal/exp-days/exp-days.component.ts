import {AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ContentService} from '../../../../cms/services/content.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {UserContent} from '../../../../cms/entities/user-content.entity';
import {CmsContent} from '../../../../cms/entities/cms-content.entity';
import {EnvironmentService} from '../../../../shared/services/environment.service';
import {SerializationService} from '../../../../cms/services/serialization.service';
import {ElementType} from '../../../../cms/enums/cms-element-type.enum';
import {ToolbarService} from '../../../../cms/services/toolbar.service';
import {SubscriptionManagerService} from '../../../services/subscription-manager.service';
import {ViewMode} from '../../../../cms/enums/cms-layout-view-mode.enum';
import {AbstractComponent} from '../../../../shared/components/abstract.component';
import {ExpDaysLayout} from '../../../../cms/cms-layouts/exp-days/exp-days.component';
import {UserContents} from '../../../../cms/entities/user-contents.entity';

@Component({
  selector: 'ut-exp-days',
  templateUrl: './exp-days.component.html',
  styleUrls: ['./exp-days.component.less'],
  providers: [ContentService, SubscriptionManagerService, ToolbarService]
})
export class ExpDaysComponent extends AbstractComponent implements AfterViewInit, OnDestroy {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  @ViewChild('expDaysLayout')
  private expDaysLayout: ExpDaysLayout;

  constructor(protected contentService: ContentService,
              protected serializationService: SerializationService,
              private authService: AuthService,
              protected envService: EnvironmentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef) {
    super();

    this.contentService.viewMode = ViewMode.EDIT_CONTENT;
  }

  ngAfterViewInit() {
    this.setStatus(StatusKey.MODEL, StatusValue.IN_PROGRESS);
    this.contentService.loadContent(
      '/user/' + this.authService.getUserId() + '/expdays',
      'de-DE',
      contents => {
        this.baseContent = UserContents.single(contents);
        if (contents.contents.length === 1) {
          this.expDaysLayout.deserialize(
            this.serializationService.deserializeElement(CmsContent.fromUserContent(this.baseContent, this.envService).content.elements[0])
          );
        }
        this.setStatus(StatusKey.MODEL, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.MODEL, StatusValue.FAILED, apiError);
      });
  }

  public save(): void {

    this.setStatus(StatusKey.SAVE, StatusValue.IN_PROGRESS);
    this.contentService.saveContent(
      false,
      this.getContent(),
      (content, userContent) => {
        this.baseContent = userContent;
        this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE, StatusValue.FAILED, apiError);
      });

  }

  private getContent(): CmsContent {
    let content = CmsContent.fromUserContent(this.baseContent, this.envService);
    return this.serializationService.serializeContent(content, this.expDaysLayout);
  }

  getElementType(): ElementType {
    return ElementType.LAYOUT;
  }


  public ngOnDestroy() {
    this.save();
  }

  get baseContent(): UserContent {
    return this.contentService.userContent;
  }

  set baseContent(baseContent: UserContent) {
    this.contentService.userContent = baseContent;
  }

}

export enum StatusKey {
  MODEL,
  SAVE
}

export enum StatusValue {
  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2
}
