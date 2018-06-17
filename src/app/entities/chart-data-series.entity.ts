import {ChartData} from './chart-data.entity';

/**
 * One data series to display in a chart.
 * @author Laurenz Fiala
 * @since 2018/06/17
 */
export class ChartDataSeries {

  public name: string;
  public series: Array<ChartData>;

  constructor(
    name: string,
    series?: Array<ChartData>
  ) {
    this.name = name;
    if (series) {
      this.series = series;
    } else {
      this.series = new Array<ChartData>();
    }
  }

  public static fromObject(o: any): ChartDataSeries {

    return new ChartDataSeries(
      o.name,
      o.series
    );

  }

}
