/**
 * One data point of xp of a user.
 *
 * @author Laurenz Fiala
 * @since 2019/02/18
 */
import * as moment from 'moment';

export class UserXp {

  public xp: number;
  public action: string;
  public date: Date;

  constructor(xp: number, action: string, date: Date) {
    this.xp = xp;
    this.action = action;
    this.date = date;
  }

  public static fromObject(o: any): UserXp {

    return new UserXp(
      o.xp,
      o.action,
      moment.utc(o.date, 'YYYY-MM-DD[T]HH-mm-ss').toDate()
    );

  }

}
