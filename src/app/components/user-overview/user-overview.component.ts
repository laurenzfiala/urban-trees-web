import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService} from '../../services/user.service';
import {UserAchievements} from '../../entities/user-achievement.entity';
import {AbstractComponent} from '../abstract.component';
import {AuthService} from '../../services/auth.service';
import {UserRewardService} from '../../services/user-reward.service';

@Component({
  selector: 'ut-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls: ['./user-overview.component.less']
})
export class UserOverviewComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Whether the user has levelled up recently.
   * The levelling data is fetched from the backend
   * by userService in #loadLevels.
   */
  public levelUp: boolean = false;

  /**
   * Emits the current level, if the user as recently levelled up.
   */
  @Output()
  public levelUpOutput: EventEmitter<number> = new EventEmitter<number>();

  /**
   * Emits the current loading status.
   */
  @Output()
  public status: EventEmitter<any[]> = new EventEmitter<any[]>();

  public username: string;

  constructor(private authService: AuthService,
              private userService: UserService,
              private rewardService: UserRewardService) {
    super();
  }

  public ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.loadAchievements();
  }

  private loadAchievements(): void {

    this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.IN_PROGRESS);
    this.status.emit([this.getStatus(StatusKey.ACHIEVEMENTS_LOADING), this.getStatusError(StatusKey.ACHIEVEMENTS_LOADING)]);
    this.rewardService.loadAchievements((achievements: UserAchievements) => {
      if (this.hasRecentLevelUp() ) {
        this.levelUp = true;
        this.levelUpOutput.emit(this.level);
      }
      this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.SUCCESSFUL);
      this.status.emit([this.getStatus(StatusKey.ACHIEVEMENTS_LOADING), this.getStatusError(StatusKey.ACHIEVEMENTS_LOADING)]);
    }, (error1, apiError) => {
      this.setStatus(StatusKey.ACHIEVEMENTS_LOADING, StatusValue.FAILED, apiError);
      this.status.emit([this.getStatus(StatusKey.ACHIEVEMENTS_LOADING), this.getStatusError(StatusKey.ACHIEVEMENTS_LOADING)]);
    });

  }

  /**
   * Whether the user levelled-up recently, or not.
   */
  private hasRecentLevelUp(): boolean {

    const recentThresholdSec = 300;
    const recentDate = new Date().getTime() - (recentThresholdSec * 1000);

    let level;
    for (let i = 1; i < this.rewardService.achievements.xpHistory.length; i++) {
      level = this.rewardService.calcLevel(this.rewardService.achievements.xpHistory[i].xp);
      if (level < this.rewardService.level) {
        if (this.rewardService.achievements.xpHistory[i - 1].date.getTime() >= recentDate) {
          return true;
        }
        return false;
      }
    }

    return false;

  }

  get maxLevel() {
    return this.rewardService.maxLevel;
  }

  get maxLevelXp() {
    return this.rewardService.maxLevelXp;
  }

  get nextLevel() {
    return this.rewardService.nextLevel;
  }

  get nextLevelXp() {
    return this.rewardService.nextLevelXp;
  }

  get nextLevelRemainingXp() {
    return this.rewardService.nextLevelRemainingXp;
  }

  get level() {
    return this.rewardService.level;
  }

  get levelXp() {
    return this.rewardService.levelXp;
  }

  get achievements() {
    return this.rewardService.achievements;
  }

}

export enum StatusKey {

  ACHIEVEMENTS_LOADING,
  DETAILS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  SHOW

}
