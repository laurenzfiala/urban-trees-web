/**
 * A single log entry for a given beacon.
 * @author Laurenz Fiala
 * @since 2019/05/20
 */
import {BeaconLogSeverity} from './BeaconLogSeverity';
import * as moment from 'moment/moment';

export class BeaconLog {

  public id: number;
  public beaconId: number;
  public severity: BeaconLogSeverity;
  public type: string;
  public message: string;
  public eventDate: Date;
  public settingsId: number;

  constructor(
    id?: number,
    beaconId?: number,
    severity?: BeaconLogSeverity,
    type?: string,
    message?: string,
    eventDate?: Date,
    settingsId?: number
  ) {
    this.id = id;
    this.beaconId = beaconId;
    this.severity = severity;
    this.type = type;
    this.message = message;
    this.eventDate = eventDate;
    this.settingsId = settingsId;
  }

  public static fromObject(o: any): BeaconLog {

    let eventDate;
    if (o.eventDate) {
      eventDate = moment.utc(o.eventDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate();
    }

    return new BeaconLog(
      o.id,
      o.beaconId,
      o.severity,
      o.type,
      o.message,
      eventDate,
      o.steeingsId
    );

  }

}
