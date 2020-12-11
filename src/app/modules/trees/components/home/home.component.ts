import { Component, OnInit } from '@angular/core';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {SystemStatistics} from '../../entities/system-statistics.entity';
import {UIService} from '../../services/ui.service';
import {LoginAccessReason} from '../project-login/logout-reason.enum';
import {ApiError} from '../../../shared/entities/api-error.entity';
import {PhenologyObservationService} from '../../services/phenology/observation/phenology-observation.service';
import {PhenologyDatasetWithTree} from '../../entities/phenology-dataset-with-tree.entity';
import * as moment from 'moment';
import {environment} from '../../../../../environments/environment';
import {ListComponent} from '../list/list.component';

@Component({
  selector: 'ut-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less', '../list/list.shared.less']
})
export class HomeComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public cmsHistory: any; // TODO
  public phenObsHistory: Array<PhenologyDatasetWithTree>;

  /**
   * Statistics regarding the system overall.
   */
  public statistics: SystemStatistics;

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
              private authService: AuthService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit() {
    this.load();
    this.setStatus(StatusKey.PHENOBS_HISTORY, StatusValue.IN_PROGRESS, new ApiError()); // TODO
  }

  /**
   * Load all resource neccessary for this page.
   */
  public load(): void {
    this.loadCmsHistory();
    this.loadPhenobsHistory();
  }

  private loadCmsHistory(successCallback?: () => void): void {

    this.setStatus(StatusKey.CMS_HISTORY, StatusValue.IN_PROGRESS);
    if (successCallback && this.cmsHistory) {
      successCallback();
      return;
    }

    /*this.cmsService.loadCmsHistory((stats: Array<Cms>) => { TODO
      this.statistics = stats;
      this.setStatus(StatusKey.CMS_HISTORY, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.CMS_HISTORY, StatusValue.FAILED, apiError);
    });*/

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
