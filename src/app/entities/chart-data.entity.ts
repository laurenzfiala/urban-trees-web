
/**
 * One data point to display in a chart.
 * @author Laurenz Fiala
 * @since 2018/06/17
 */
export class ChartData {

  public name: string;
  public value: number;

  constructor(
    name: string,
    value: number
  ) {
    this.name = name;
    this.value = value;
  }

  public static fromObject(o: any): ChartData {

    return new ChartData(
      o.name,
      o.value
    );

  }

}
