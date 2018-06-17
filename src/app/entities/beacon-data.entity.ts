/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
import * as moment from 'moment';

/**
 * Single beacon data point.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
export class BeaconData {

  public id: number;
  public temperature: number;
  public humidity: number;
  public dewPoint: number;
  public observationDate: Date;

  constructor(
    id: number,
    temperature: number,
    humidity: number,
    dewPoint: number,
    observationDate: string
  ) {
    this.id = id;
    this.temperature = temperature;
    this.humidity = humidity;
    this.dewPoint = dewPoint;
    this.observationDate = moment(observationDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate();
  }

  public static fromObject(o: any): BeaconData {

    return new BeaconData(
      o.id,
      o.temperature,
      o.humidity,
      o.dewPoint,
      o.observationDate
    );

  }

}
