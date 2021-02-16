import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {SystemStatistics} from '../../entities/system-statistics.entity';
import {UIService} from '../../services/ui.service';
import {ChartDataSeries} from '../../entities/chart-data-series.entity';
import {ChartData} from '../../entities/chart-data.entity';
import * as moment from 'moment';
import {Moment} from 'moment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.less']
})
export class StatisticsComponent extends AbstractComponent implements OnInit {

  private static CHART_LAST_N_DAYS: number = 14;

  public StatusValue = StatusValue;
  public StatusKey = StatusKey;

  /**
   * Statistics regarding the trees overall.
   */
  public statistics: SystemStatistics;

  public colorScheme: any = {domain: ['#3e4da4']};

  public beaconChartData: Array<ChartDataSeries>;
  public phenologyObsChartData: Array<ChartDataSeries>;

  constructor(private uiService: UIService,
              private translateService: TranslateService) {
    super();
  }

  public ngOnInit() {
    this.load();
  }

  /**
   * Load all resource necessary for this page.
   */
  public async load() {
    await this.translateService.get('app.title').toPromise(); // ensure translations are loaded
    this.loadStatistics(() => {

      let today = moment().startOf('day');
      let dataIndex = 0, currentDay, value, label;

      // beacon chart
      this.beaconChartData = [new ChartDataSeries('Read-outs', new Array<ChartData>())]; // TODO translate
      currentDay = today.clone().subtract(StatisticsComponent.CHART_LAST_N_DAYS, 'day');
      while (!currentDay.isAfter(today)) {
        label = this.dateFormat(currentDay);
        if (dataIndex < this.statistics.beaconReadouts.length
          && this.dateFormat(moment(this.statistics.beaconReadouts[dataIndex].time)) === label) {
          value = this.statistics.beaconReadouts[dataIndex].value;
          dataIndex++;
        } else {
          value = 0;
        }
        this.beaconChartData[0].series.push(new ChartData(label, value));
        currentDay.add(1, 'day');
      }

      // phen obs chart
      this.phenologyObsChartData = [new ChartDataSeries('Observations', new Array<ChartData>())]; // TODO translate
      currentDay = today.clone().subtract(StatisticsComponent.CHART_LAST_N_DAYS, 'day');
      dataIndex = 0;
      while (!currentDay.isAfter(today)) {
        label = this.dateFormat(currentDay);
        if (dataIndex < this.statistics.phenologyObservations.length
          && this.dateFormat(moment(this.statistics.phenologyObservations[dataIndex].time)) === label) {
          value = this.statistics.phenologyObservations[dataIndex].value;
          dataIndex++;
        } else {
          value = 0;
        }
        this.phenologyObsChartData[0].series.push(new ChartData(label, value));
        currentDay.add(1, 'day');
      }

    });
  }

  private dateFormat(d: Moment): string {
    return d.format(this.translateService.instant('app.date_format_day'));
  }

  /**
   * Load system stats using UIService.
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
      if (successCallback) {
        successCallback();
      }
      this.setStatus(StatusKey.STATISTICS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.STATISTICS, StatusValue.FAILED, apiError);
    });

  }

}

export enum StatusKey {

  STATISTICS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
