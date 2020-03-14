/**
 * An application event.
 *
 * @author Laurenz Fiala
 * @since 2019/07/31
 */
import {Report} from './report.entity';

export class Event {

  public id: number;
  public message: string;
  public details: string;
  public severity: EventSeverity;
  public remark: string;
  public eventDate: Date;

  constructor(id: number,
              message: string,
              details: string,
              severity: EventSeverity,
              remark: string,
              eventDate: Date) {
    this.id = id;
    this.message = message;
    this.details = details;
    this.severity = severity;
    this.remark = remark;
    this.eventDate = eventDate;
  }

  public static fromObject(o: any): Event {

    return new Event(
      o.id,
      o.message,
      o.details,
      o.severity,
      o.remark,
      o.eventDate
    );

  }

}

export enum EventSeverity {

  EXCEPTION,
  SUSPICIOUS,
  INTERNAL

}
