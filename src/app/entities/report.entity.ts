/**
 * A report.
 *
 * @author Laurenz Fiala
 * @since 2019/07/31
 */
import {User} from './user.entity';
import {Event} from './event.entity';

export class Report {

  public id: number;
  public message: string;
  public assocEvent: Event;
  public assocUser: User;
  public autoCreate: boolean;
  public resolved: boolean;
  public remark: string;

  constructor(id: number,
              message: string,
              assocEvent: Event,
              assocUser: User,
              autoCreate: boolean,
              resolved: boolean,
              remark: string) {
    this.id = id;
    this.message = message;
    this.assocEvent = assocEvent;
    this.assocUser = assocUser;
    this.autoCreate = autoCreate;
    this.resolved = resolved;
    this.remark = remark;
  }

  public static fromObject(o: any): Report {

    return new Report(
      o.id,
      o.message,
      o.assocEvent && Event.fromObject(o.assocEvent),
      o.assocUser && User.fromObject(o.assocUser),
      o.autoCreate,
      o.resolved,
      o.remark
    );

  }

}
