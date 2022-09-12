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

@Component({
  selector: 'ut-exp-days',
  templateUrl: './exp-days.component.html',
  styleUrls: ['./exp-days.component.less'],
  providers: [ContentService, SubscriptionManagerService, ToolbarService]
})
export class ExpDaysComponent extends AbstractComponent implements AfterViewInit, OnDestroy {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private baseContent: UserContent;

  @ViewChild('expDaysLayout')
  private expDaysLayout: ExpDaysLayout;

  constructor(protected contentService: ContentService,
              protected serializationService: SerializationService,
              private authService: AuthService,
              protected envService: EnvironmentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef) {
    super();

    this.contentService.setContentPath('/user/' + this.authService.getUserId() + '/expdays');
    this.contentService.viewMode = ViewMode.EDIT_CONTENT;
  }

  ngAfterViewInit() {
    this.setStatus(StatusKey.MODEL, StatusValue.IN_PROGRESS);
    this.contentService.loadContent(
      this.contentService.contentPath().value,
      'de-DE'/*this.translateService.currentLang*/,
      content => {
        this.baseContent = content[0];
        if (content[0]) {
          this.expDaysLayout.deserialize(this.serializationService.deserializeElement(CmsContent.fromUserContent(content[0], this.envService).content.elements[0]));
        }
        // TODO this.expDaysLayout.update();
        this.setStatus(StatusKey.MODEL, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.MODEL, StatusValue.FAILED, apiError);
      });
  }

  public save(): void {

    this.setStatus(StatusKey.SAVE, StatusValue.IN_PROGRESS);
    this.contentService.saveContent(
      this.contentService.contentPath().value,
      this.baseContent ? this.baseContent.contentLanguage : 'de-DE'/*this.translateService.currentLang*/,
      false,
      this.getContent(),
      userContent => {
        this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE, StatusValue.FAILED, apiError);
      }
      );

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
