import {Component, ComponentFactoryResolver, OnInit} from '@angular/core';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {SystemStatistics} from '../../entities/system-statistics.entity';
import {UIService} from '../../services/ui.service';
import {RenderService} from '../../../cms/services/render.service';

@Component({
  selector: 'ut-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Statistics regarding the system overall.
   */
  public statistics: SystemStatistics;

  constructor(private uiService: UIService,
              private authService: AuthService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit() {
    this.load();
  }

  /**
   * Load all resource neccessary for this page.
   */
  public load(): void {
    this.loadStatistics();
  }

  /**
   * Load tree stats using TreeListService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadStatistics(successCallback?: () => void): void {

    this.setStatus(StatusKey.STATISTICS, StatusValue.IN_PROGRESS);
    if (successCallback && this.statistics) {
      successCallback();
      return;
    }

    this.uiService.loadSystemStatistics((stats: SystemStatistics) => {
      this.statistics = stats;
      this.setStatus(StatusKey.STATISTICS, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.STATISTICS, StatusValue.FAILED, apiError);
    });

  }

  public getUsername(): string {
    return this.authService.getUsername();
  }

}

export enum StatusKey {

  USER_LEVEL_UP,
  USER_OVERVIEW,
  STATISTICS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  LEVELLED_UP

}
