import {Beacon} from './beacon.entity';
import {BeaconData} from './beacon-data.entity';
import {BeaconStatus} from './beacon-status.entity';
import {ChartDataSeries} from './chart-data-series.entity';
import {ChartData} from './chart-data.entity';
import * as moment from 'moment';

/**
 * Used to attach beacon data to the beacon info.
 *
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
export class BeaconFrontend extends Beacon {

  public datasets: Array<BeaconData>;

  public chartData: Array<ChartDataSeries>;

  constructor(
    id: number,
    deviceId: string,
    treeId: number,
    bluetoothAddress: string,
    status: BeaconStatus
  ) {
    super(id, deviceId, treeId, bluetoothAddress, status);
  }

  /**
   * TODO
   */
  public populateChartData(): void {

    this.chartData = new Array<ChartDataSeries>(3);
    this.chartData[0] = new ChartDataSeries('Temperature');
    this.chartData[1] = new ChartDataSeries('Humidity');
    this.chartData[2] = new ChartDataSeries('Dew Point');

    let datasetDate;
    this.datasets.forEach(dataset => {
      datasetDate = moment(dataset.observationDate).format('MM-DD HH:mm');
      this.chartData[0].series.push(new ChartData(datasetDate, dataset.temperature));
      this.chartData[1].series.push(new ChartData(datasetDate, dataset.humidity));
      this.chartData[2].series.push(new ChartData(datasetDate, dataset.dewPoint));
    });

  }

  public static fromObject(o: any): Beacon {

    return new BeaconFrontend(
      o.id,
      o.deviceId,
      o.treeId,
      o.bluetoothAddress,
      o.status
    );

  }

}
