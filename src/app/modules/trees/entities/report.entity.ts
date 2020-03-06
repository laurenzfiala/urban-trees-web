/**
 * A report.
 *
 * @author Laurenz Fiala
 * @since 2019/07/31
 */
import {User} from './user.entity';
import {Event} from './event.entity';
import {EnvironmentService} from '../services/environment.service';
import * as moment from 'moment';

export class Report {

  public id: number;
  public message: string;
  public assocEvent: Event;
  public assocUser: User;
  public autoCreate: boolean;
  public resolved: boolean;
  public remark: string;
  public reportDate: Date;

  constructor(id?: number,
              message?: string,
              assocEvent?: Event,
              assocUser?: User,
              autoCreate?: boolean,
              resolved?: boolean,
              remark?: string,
              reportDate?: Date) {
    this.id = id;
    this.message = message;
    this.assocEvent = assocEvent;
    this.assocUser = assocUser;
    this.autoCreate = autoCreate;
    this.resolved = resolved;
    this.remark = remark;
    this.reportDate = reportDate;
  }

  public static fromObject(o: any, envService: EnvironmentService): Report {

    return new Report(
      o.id,
      o.message,
      o.assocEvent && Event.fromObject(o.assocEvent),
      o.assocUser && User.fromObject(o.assocUser),
      o.autoCreate,
      o.resolved,
      o.remark,
      o.reportDate && moment.utc(o.reportDate, envService.outputDateFormat).toDate()
    );

  }

}
