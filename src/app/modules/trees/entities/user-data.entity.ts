import * as moment from 'moment/moment';
import {Role} from './role.entity';

/**
 * Holds quick-access user information.
 *
 * @author Laurenz Fiala
 * @since 2019/07/29
 */
export class UserData {

  public newMessagesAmount: number;

  constructor(newMessagesAmount?: number) {
    this.newMessagesAmount = newMessagesAmount;
  }

  public static fromObject(o: any): UserData {

    return new UserData(
      o.newMessagesAmount
    );

  }

}
