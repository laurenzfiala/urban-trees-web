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
  public assocReport: Report;
  public remark: string;
  public eventDate: Date;

  constructor(id: number,
              message: string,
              details: string,
              severity: EventSeverity,
              assocReport: Report,
              remark: string,
              eventDate: Date) {
    this.id = id;
    this.message = message;
    this.details = details;
    this.severity = severity;
    this.assocReport = assocReport;
    this.remark = remark;
    this.eventDate = eventDate;
  }

  public static fromObject(o: any): Event {

    return new Event(
      o.id,
      o.message,
      o.details,
      o.severity,
      o.assocReport && Report.fromObject(o.assocReport),
      o.id,
      o.id
    );

  }

}

export enum EventSeverity {

  EXCEPTION,
  SUSPICIOUS,
  INTERNAL

}
