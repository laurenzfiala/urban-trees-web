import { Component, OnInit } from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserAchievements} from '../../entities/user-achievement.entity';
import {AbstractComponent} from '../abstract.component';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'ut-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.less']
})
export class UserOverviewComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Highest reachable level.
   */
  public maxLevel: number = 15;

  /**
   * TODO
   */
  public maxLevelXp: number;

  /**
   * TODO
   */
  public nextLevel: number;

  /**
   * TODO
   */
  public nextLevelXp: number;

  /**
   * TODO
   */
  public nextLevelRemainingXp: number;

  /**
   * TODO
   */
  public level: number = 0;

  /**
   * TODO
   */
  public levelXp: number = 0;

  /**
   * TODO
   */
  public lastLevel: number = 0;

  /**
   * Whether the user has levelled up recently.
   * The levelling data is fetched from the backend
   * by userService in #loadLevels.
   */
  public levelUp: boolean = false;

  /**
   * TODO
   */
  public achievements: UserAchievements;

  public username: string;

  constructor(private authService: AuthService,
              private userService: UserService) {
    super();
  }

  public ngOnInit(): void {

    this.username = this.authService.getUsername();
    this.loadAchievements();

  }

  /**
   * TODO
   */
  private loadAchievements(): void {

    this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.IN_PROGRESS);
    this.userService.loadAchievements((achievements: UserAchievements) => {
      this.achievements = achievements;
      this.updateLevels();
      this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.SUCCESSFUL);
    }, (error1, apiError) => {
      this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.FAILED);
    })

  }

  /**
   * TODO
   */
  private updateLevels(): void {

    this.maxLevelXp = this.calcRequiredXp(this.maxLevel);
    let xp = this.achievements.xp;
    if (this.achievements.xp > this.maxLevelXp) {
      xp = this.maxLevelXp;
    }
    this.level = this.calcLevel(xp);
    this.levelXp = this.calcRequiredXp(this.level);
    this.nextLevel = this.level < this.maxLevel ? this.level + 1 : this.maxLevel;
    this.nextLevelXp = this.calcRequiredXp(this.nextLevel);
    this.nextLevelRemainingXp = this.nextLevelXp - xp;
    if (this.hasRecentLevelUp(this.level) ) {
      this.levelUp = true;
    }

  }

  /**
   * Whether the user levelled-up recently, or not.
   */
  private hasRecentLevelUp(currentLevel: number): boolean {

    const recentThresholdSec = 300;
    const recentDate = new Date().getTime() - (recentThresholdSec * 1000);

    let level;
    for (let i = 1; i < this.achievements.xpHistory.length; i++) {
      level = this.calcLevel(this.achievements.xpHistory[i].xp);
      if (level < currentLevel) {
        if (this.achievements.xpHistory[i - 1].date.getTime() >= recentDate) {
          return true;
        }
        return false;
      }
    }

    return false;

  }

  /**
   * TODO
   */
  public calcLevel(xp: number): number {

    let i;
    for (i = 100; xp >= i; i += 100) {
      xp -= i;
    }
    return i / 100;

  }

  /**
   * TODO
   */
  public calcRequiredXp(level: number): number {

    let xp = 0;
    for (let i = 0; i < level; i++) {
      xp += i * 100;
    }
    return xp;

  }

}

export enum StatusKey {

  ACHIEVEMENTS_LOADING

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
