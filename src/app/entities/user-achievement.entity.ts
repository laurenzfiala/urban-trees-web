/**
 * Holds all users achievement information.
 *
 * @author Laurenz Fiala
 * @since 2019/01/15
 */
export class UserAchievements {

  public xp: number;

  public lastXp: number;

  constructor(xp: number, lastXp: number) {
    this.xp = xp;
    this.lastXp = lastXp;
  }

  public static fromObject(o: any): UserAchievements {

    return new UserAchievements(
      o.xp,
      o.lastXp
    );

  }

}
