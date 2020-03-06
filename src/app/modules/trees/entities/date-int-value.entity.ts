/**
 * Single value in time for a chart.
 *
 * @author Laurenz Fiala
 * @since 2019/07/14
 */
import * as moment from 'moment';

export class DateIntValue {

  public time: Date;
  public value: number;

  constructor(time: Date,
              value: number) {
    if (time) {
      this.time = moment.utc(time, 'YYYY-MM-DD[T]HH-mm-ss').toDate();
    }
    this.value = value;
  }

  public static fromObject(o: any): DateIntValue {

    return new DateIntValue(
      o.time,
      o.value
    );

  }

}
