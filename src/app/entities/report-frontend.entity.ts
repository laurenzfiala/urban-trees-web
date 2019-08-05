/**
 * A report with frontend vars.
 *
 * @author Laurenz Fiala
 * @since 2019/08/02
 */
import {User} from './user.entity';
import {Event} from './event.entity';
import {Report} from './report.entity';

export class ReportFrontend extends Report {

  public wasResolved: boolean = false;

  constructor(id: number,
              message: string,
              assocEvent: Event,
              assocUser: User,
              autoCreate: boolean,
              resolved: boolean,
              remark: string) {
    super(id, message, assocEvent, assocUser, autoCreate, resolved, remark);
  }

  public static fromObject(o: any): Report {

    return new ReportFrontend(
      o.id,
      o.message,
      o.assocEvent,
      o.assocUser,
      o.autoCreate,
      o.resolved,
      o.remark
    );

  }

}
