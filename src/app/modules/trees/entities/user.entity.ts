import * as moment from 'moment/moment';
import {Role} from './role.entity';

/**
 * Holds user account information.
 *
 * @author Laurenz Fiala
 * @since 2018/07/08
 */
export class User {

  public id: number;
  public username: string;
  public active: boolean;
  public credentialsNonExpired: boolean;
  public nonLocked: boolean;
  public failedloginAttempts: number;
  public lastLoginAttemptDate: Date;
  public lastLoginDate: Date;
  public roles: Array<Role>;
  public usingOtp: boolean;

  public deleteStatus: number;
  public secureLoginKey: string;

  constructor(id?: number,
              username?: string,
              active?: boolean,
              credentialsNonExpired?: boolean,
              nonLocked?: boolean,
              failedloginAttempts?: number,
              lastLoginAttemptDate?: string,
              lastLoginDate?: string,
              roles?: Array<Role>,
              usingOtp?: boolean,
              secureLoginKey?: string) {
    this.id = id;
    this.username = username;
    this.active = active;
    this.credentialsNonExpired = credentialsNonExpired;
    this.nonLocked = nonLocked;
    this.failedloginAttempts = failedloginAttempts;
    if (lastLoginAttemptDate) {
      this.lastLoginAttemptDate = moment.utc(lastLoginAttemptDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate();
    }
    if (lastLoginDate) {
      this.lastLoginDate = moment.utc(lastLoginDate, 'YYYY-MM-DD[T]HH-mm-ss').toDate();
    }
    this.roles = roles;
    this.usingOtp = usingOtp;
    this.secureLoginKey = secureLoginKey;
  }

  public static fromObject(o: any): User {

    return new User(
      o.id,
      o.username,
      o.active,
      o.credentialsNonExpired,
      o.nonLocked,
      o.failedloginAttempts,
      o.lastLoginAttemptDate,
      o.lastLoginDate,
      o.roles && o.roles.map(r => Role.fromObject(r)),
      o.usingOtp,
      o.secureLoginKey
    );

  }

}
