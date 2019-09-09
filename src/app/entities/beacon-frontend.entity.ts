import {Beacon} from './beacon.entity';
import {BeaconData} from './beacon-data.entity';
import {BeaconStatus} from './beacon-status.entity';
import {ChartDataSeries} from './chart-data-series.entity';
import {ChartData} from './chart-data.entity';
import * as moment from 'moment';
import {BeaconDataMode} from './beacon-data-mode.entity';
import {BeaconLog} from './beacon-log.entity';
import {TranslateService} from '@ngx-translate/core';
import {Tree} from './tree.entity';
import {MapMarker} from '../interfaces/map-marker.interface';
import {TreeLight} from './tree-light.entity';
import {BeaconSettings} from './beacon-settings.entity';
import {Location} from './location.entity';

/**
 * Used to attach beacon data to the beacon info.
 *
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
export class BeaconFrontend extends Beacon implements MapMarker {

  public datasets: Array<BeaconData>;

  public chartData: Array<ChartDataSeries>;

  public deleteStatus: number;

  public isLogsShown: boolean = false;
  public logLoadingStatus: number;
  public canShowMoreLogs: boolean = true;
  public logs: Array<BeaconLog> = new Array<BeaconLog>();

  public settingsLoadingStatus: number;

  constructor(
    id?: number,
    deviceId?: string,
    tree?: TreeLight,
    bluetoothAddress?: string,
    status?: BeaconStatus,
    location?: Location,
    settings?: BeaconSettings
  ) {
    super(id, deviceId, tree, bluetoothAddress, status, location, settings);
  }

  /**
   * TODO
   */
  public populateChartData(mode: BeaconDataMode, translateService: TranslateService): void {

    let dateFormat = translateService.instant('app.date_format_day');
    let dateFormatWithTime = translateService.instant('app.date_format_short');

    if (mode === BeaconDataMode.TEMP_LAST_MONTH_PER_DAY) {

      this.chartData = new Array<ChartDataSeries>(3);
      this.chartData[0] = new ChartDataSeries('Temperature Min');
      this.chartData[1] = new ChartDataSeries('Temperature Avg');
      this.chartData[2] = new ChartDataSeries('Temperature Max');

      let dataset, nextDataset, datasetDate;
      let tempMin, tempAvg, tempMax, tempSum = 0, dataPerDayCounter = 0;

      for (let i = 1; i <= this.datasets.length; i++) {

        nextDataset = this.datasets[i];
        if (i > 0) {
          dataset = this.datasets[i-1];
          datasetDate = moment(dataset.observationDate).format(dateFormat);
        }

        dataPerDayCounter++;
        tempSum += dataset.temperature;
        if (tempMin === undefined || tempMin > dataset.temperature) {
          tempMin = dataset.temperature;
        }

        if (tempMax === undefined || tempMax < dataset.temperature) {
          tempMax = dataset.temperature;
        }

        if (!nextDataset || datasetDate !== moment(nextDataset.observationDate).format(dateFormat)) {
          this.chartData[0].series.push(new ChartData(datasetDate, tempMin));
          this.chartData[1].series.push(new ChartData(datasetDate, tempSum / dataPerDayCounter));
          this.chartData[2].series.push(new ChartData(datasetDate, tempMax));

          dataPerDayCounter = 0;
          tempMin = undefined;
          tempAvg = undefined;
          tempMax = undefined;
          tempSum = 0;
        }

      }

    } else if (mode === BeaconDataMode.HUMI_LAST_MONTH_PER_DAY) {

      this.chartData = new Array<ChartDataSeries>(3);
      this.chartData[0] = new ChartDataSeries('Humidity Min');
      this.chartData[1] = new ChartDataSeries('Humidity Avg');
      this.chartData[2] = new ChartDataSeries('Humidity Max');

      let dataset, nextDataset, datasetDate;
      let tempMin, tempAvg, tempMax, tempSum = 0, dataPerDayCounter = 0;

      for (let i = 1; i <= this.datasets.length; i++) {

        nextDataset = this.datasets[i];
        if (i > 0) {
          dataset = this.datasets[i-1];
          datasetDate = moment(dataset.observationDate).format(dateFormat);
        }

        dataPerDayCounter++;
        tempSum += dataset.humidity;
        if (tempMin === undefined || tempMin > dataset.humidity) {
          tempMin = dataset.humidity;
        }

        if (tempMax === undefined || tempMax < dataset.humidity) {
          tempMax = dataset.humidity;
        }

        if (!nextDataset || datasetDate !== moment(nextDataset.observationDate).format(dateFormat)) {
          this.chartData[0].series.push(new ChartData(datasetDate, tempMin));
          this.chartData[1].series.push(new ChartData(datasetDate, tempSum / dataPerDayCounter));
          this.chartData[2].series.push(new ChartData(datasetDate, tempMax));

          dataPerDayCounter = 0;
          tempMin = undefined;
          tempAvg = undefined;
          tempMax = undefined;
          tempSum = 0;
        }

      }

    } else {

      this.chartData = new Array<ChartDataSeries>(3);
      this.chartData[0] = new ChartDataSeries('Temperature');
      this.chartData[1] = new ChartDataSeries('Humidity');
      this.chartData[2] = new ChartDataSeries('Dew Point');

      let datasetDate;
      this.datasets.forEach(dataset => {
        datasetDate = moment(dataset.observationDate).format(dateFormatWithTime);
        this.chartData[0].series.push(new ChartData(datasetDate, dataset.temperature));
        this.chartData[1].series.push(new ChartData(datasetDate, dataset.humidity));
        this.chartData[2].series.push(new ChartData(datasetDate, dataset.dewPoint));
      });

    }

  }

  // MapMarker interface methods
  public getCoordsX(): number {
    if (!this.location || !this.location.coordinates) {
      return undefined;
    }
    return this.location.coordinates.x;
  }

  public getCoordsY(): number {
    if (!this.location || !this.location.coordinates) {
      return undefined;
    }
    return this.location.coordinates.y;
  }

  public getId(): number {
    return this.id;
  }

  public getProjection(): string {
    if (!this.location || !this.location.coordinates) {
      return undefined;
    }
    return this.location.coordinates.projection;
  }

  public static fromObject(o: any): BeaconFrontend {

    return new BeaconFrontend(
      o.id,
      o.deviceId,
      o.tree && TreeLight.fromObject(o.tree),
      o.bluetoothAddress,
      o.status,
      o.location && Location.fromObject(o.location),
      o.settings && BeaconSettings.fromObject(o.settings)
    );

  }

  public static fromBeacon(o: Beacon): BeaconFrontend {

    return new BeaconFrontend(
      o.id,
      o.deviceId,
      o.tree && TreeLight.fromObject(o.tree),
      o.bluetoothAddress,
      o.status,
      o.location && Location.fromObject(o.location),
      o.settings && BeaconSettings.fromObject(o.settings)
    );

  }

}
