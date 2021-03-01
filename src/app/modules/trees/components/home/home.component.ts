import {Component, OnDestroy, OnInit} from '@angular/core';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {SystemStatistics} from '../../entities/system-statistics.entity';
import {UIService} from '../../services/ui.service';
import {LoginAccessReason} from '../project-login/logout-reason.enum';
import {PhenologyObservationService} from '../../services/phenology/observation/phenology-observation.service';
import {PhenologyDatasetWithTree} from '../../entities/phenology-dataset-with-tree.entity';
import * as moment from 'moment';
import {environment} from '../../../../../environments/environment';
import {ListComponent} from '../list/list.component';
import {
  CmsComponentConfig,
  CmsContentConfig,
  CmsLayoutConfig,
  CmsLayoutSlotConfig
} from '../../../cms/entities/content-config.entity';
import {BlockLayout} from '../../../cms/cms-layouts/block-layout/block-layout.component';
import {TextComponent} from '../../../cms/cms-components/text/text.component';
import {ContentService} from '../../../cms/services/content.service';
import {TreeService} from '../../services/tree.service';
import {CmsContentContextRef} from '../../../cms/entities/cms-content-context-ref.entity';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {Tree} from '../../entities/tree.entity';
import {forkJoin} from 'rxjs';
import {tap} from 'rxjs/operators';
import {CmsContent} from '../../../cms/entities/cms-content.entity';
import {UserContentMetadata} from '../../../cms/entities/user-content-metadata.entity';
import {ViewMode} from '../../../cms/enums/cms-layout-view-mode.enum';

@Component({
  selector: 'ut-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less', '../list/list.shared.less']
})
export class HomeComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static SUBSCRIPTION_TAG: string = 'observation-cmp';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public treeCmsHistory: Array<CmsContentContextRef<Tree>>;
  public phenObsHistory: Array<PhenologyDatasetWithTree>;

  /**
   * Statistics regarding the system overall.
   */
  public statistics: SystemStatistics;

  public ViewMode = ViewMode;
  public testContent: CmsContent;
  public testContentViewMode: ViewMode = ViewMode.CONTENT;
  public testContentConfig: CmsContentConfig = new CmsContentConfig(
    [new CmsLayoutConfig(
      BlockLayout,
      [
        new CmsLayoutSlotConfig(
          'all',
          'all'
        )
      ]
    )],
    [new CmsComponentConfig(TextComponent)]
  );

  constructor(private uiService: UIService,
              private phenObsService: PhenologyObservationService,
              private contentService: ContentService,
              private treeService: TreeService,
              private authService: AuthService,
              private subs: SubscriptionManagerService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit() {
    this.load();
    this.setStatus(StatusKey.PHENOBS_HISTORY, StatusValue.IN_PROGRESS);

    this.contentService.loadContent('news', 'en_GB', content => {
      this.testContent = CmsContent.fromUserContent(content[0], this.envService);
    });
  }

  public ngOnDestroy() {
    this.subs.unsubscribe(HomeComponent.SUBSCRIPTION_TAG);
  }

  /**
   * Load all resource neccessary for this page.
   */
  public load(): void {
    this.loadCmsHistory();
    this.loadPhenobsHistory();
  }

  private loadCmsHistory(): void {

    this.setStatus(StatusKey.CMS_HISTORY, StatusValue.IN_PROGRESS);
    if (this.treeCmsHistory) {
      return;
    }

    this.contentService.loadCmsUserHistory('tree-', (history: Array<UserContentMetadata>) => {

      let contextRefs = history
        .map(value => this.contentService.getContentContextRef(value.contentId).for(value));
      let loadTreeObservables = contextRefs.map(value => {
        return this.treeService.loadTreeObservable(Number(value.idComponent)).pipe(tap(tree => {
          value.context = tree;
        }));
      });
      forkJoin(...loadTreeObservables).subscribe(filledContexts => {
        this.treeCmsHistory = contextRefs;
        this.setStatus(StatusKey.CMS_HISTORY, StatusValue.SUCCESSFUL);
      }, error => {
        this.setStatus(StatusKey.CMS_HISTORY, StatusValue.FAILED);
      });

    }, (error, apiError) => {
      this.setStatus(StatusKey.CMS_HISTORY, StatusValue.FAILED, apiError);
    });

  }

  private loadPhenobsHistory(successCallback?: () => void): void {

    this.setStatus(StatusKey.PHENOBS_HISTORY, StatusValue.IN_PROGRESS);
    if (successCallback && this.phenObsHistory) {
      successCallback();
      return;
    }

    this.phenObsService.loadUserHistory(this.authService.getUserId(), (history: Array<PhenologyDatasetWithTree>) => {
      this.phenObsHistory = history;
      this.setStatus(StatusKey.PHENOBS_HISTORY, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.PHENOBS_HISTORY, StatusValue.FAILED, apiError);
    });

  }

  /**
   * Log the user out and redirects to login page.
   */
  public logout(): void {
    this.authService.logout();
    this.authService.redirectToLogin(LoginAccessReason.USER_LOGOUT);
  }

  public phenObsHistoryCategorizer(dataset: PhenologyDatasetWithTree): string {
    const date = moment.utc(dataset.observationDate, environment.outputDateFormat);
    return ListComponent.historyCategorizer(date);
  }

  public cmsContentHistoryCategorizer(ref: CmsContentContextRef<Tree>): string {
    const date = moment.utc(ref.metadata.saveDate, environment.outputDateFormat);
    return ListComponent.historyCategorizer(date);
  }

  public getUsername(): string {
    return this.authService.getUsername();
  }

}

export enum StatusKey {

  USER_LEVEL_UP,
  USER_ACHIEVEMENTS,
  STATISTICS,
  CMS_HISTORY,
  PHENOBS_HISTORY

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  LEVELLED_UP

}
