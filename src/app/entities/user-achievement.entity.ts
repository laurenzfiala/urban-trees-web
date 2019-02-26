/**
 * Holds all users achievement information.
 *
 * @author Laurenz Fiala
 * @since 2019/01/15
 */
import {UserXp} from './user-xp.entity';

export class UserAchievements {

  public xp: number;
  public lastXp: number;
  public xpHistory: Array<UserXp>;

  constructor(xp: number, lastXp: number, xpHistory: Array<UserXp>) {
    this.xp = xp;
    this.lastXp = lastXp;
    this.xpHistory = xpHistory;
  }

  public static fromObject(o: any): UserAchievements {

    return new UserAchievements(
      o.xp,
      o.lastXp,
      o.xpHistory && o.xpHistory.map(h => UserXp.fromObject(h))
    );

  }

}
