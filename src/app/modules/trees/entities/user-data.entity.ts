import * as moment from 'moment/moment';
import {Role} from './role.entity';

/**
 * Holds quick-access user information.
 *
 * @author Laurenz Fiala
 * @since 2019/07/29
 */
export class UserData {

  public unresolvedReportsAmount: number;
  public unapprovedContentAmount: number;

  constructor(unresolvedReportsAmount?: number,
              unapprovedContentAmount?: number) {
    this.unresolvedReportsAmount = unresolvedReportsAmount;
    this.unapprovedContentAmount = unapprovedContentAmount;
  }

  public static fromObject(o: any): UserData {

    return new UserData(
      o.unresolvedReportsAmount,
      o.unapprovedContentAmount
    );

  }

}
