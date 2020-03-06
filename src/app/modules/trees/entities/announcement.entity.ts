import * as moment from 'moment';

/**
 * Announcement to show fetched from the backend.
 *
 * @author Laurenz Fiala
 * @since 2018/02/22
 */
export class Announcement {

  public id: number;
  public title: string;
  public description: string;
  public severity: number;
  public displayFromDate: Date;
  public displayToDate: Date;

  public deleteStatus: number;

  constructor(id?: number, title?: string, description?: string, severity?: number, displayFromDate?: Date, displayToDate?: Date) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.severity = severity;
    this.displayFromDate = displayFromDate;
    this.displayToDate = displayToDate;
  }

  public static fromObject(o: any): Announcement {

    return new Announcement(
      o.id,
      o.title,
      o.description,
      o.severity,
      moment.utc(o.displayFromDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate(),
      moment.utc(o.displayToDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate()
    );

  }

}
