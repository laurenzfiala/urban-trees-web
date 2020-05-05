import {Injectable} from '@angular/core';
import {Notification, NotificationType} from '../entities/notification.entity';
import {UserAchievements} from '../entities/user-achievement.entity';
import {UserService} from './user.service';
import {NotificationsService} from './notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../entities/api-error.entity';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from './auth.service';
import {filter} from 'rxjs/operators';
import {LoginStatus} from '../components/project-login/login-status.enum';

/**
 * Provides logic for levelling, etc.
 *
 * @author Laurenz Fiala
 * @since 2019/09/20
 */
@Injectable({
  providedIn: 'root'
})
export class UserRewardService {

  /**
   * Highest reachable level.
   */
  public maxLevel: number = 15;

  public maxLevelXp: number;
  public nextLevel: number;
  public nextLevelXp: number;
  public nextLevelRemainingXp: number;
  public level: number;
  public levelXp: number = 0;
  public achievements: UserAchievements;

  constructor(private userService: UserService,
              private translateService: TranslateService,
              private notificationsService: NotificationsService,
              private authService: AuthService) {

    // reset this service whenever the user is logged out
    this.authService.onStateChanged()
      .pipe(filter(value => value === LoginStatus.NOT_AUTHENTICATED))
      .subscribe(value => {
      this.reset();
    });

    this.reset();
    this.loadAchievements();

  }

  public loadAchievements(successCallback?: (achievements: UserAchievements) => void,
                          errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    if (this.authService.isUserAnonymous()) {
      return;
    }

    this.userService.loadAchievements((achievements: UserAchievements) => {
      this.achievements = achievements;
      this.updateLevels();
      if (successCallback) {
        successCallback(achievements);
      }
    }, (error, apiError) => {
      if (errorCallback) {
        errorCallback(error, apiError);
      }
    });

  }

  /**
   * Reset the reward service and remove all
   * previously stored data.
   */
  private reset(): void {

    this.maxLevelXp = undefined;
    this.nextLevel = undefined;
    this.nextLevelXp = undefined;
    this.nextLevelRemainingXp = undefined;
    this.level = undefined;
    this.levelXp = 0;
    this.achievements = undefined;

  }

  private updateLevels(): void {

    if (!this.achievements) {
      return;
    }

    this.maxLevelXp = this.calcRequiredXp(this.maxLevel);
    let xp = this.achievements.xp;
    if (this.achievements.xp > this.maxLevelXp) {
      xp = this.maxLevelXp;
    }
    let level = this.calcLevel(xp);
    if (this.level !== undefined && this.level < level) {
      let n = new Notification(
        this.translateService.instant('notifications.level_up.title'),
        this.translateService.instant('notifications.level_up.subtitle', {level: level}),
        NotificationType.levelup
      );
      n.icontext = level + '';
      this.notificationsService.showNotification(n);
    }
    this.level = level;
    this.levelXp = this.calcRequiredXp(this.level);
    this.nextLevel = this.level < this.maxLevel ? this.level + 1 : this.maxLevel;
    this.nextLevelXp = this.calcRequiredXp(this.nextLevel);
    this.nextLevelRemainingXp = this.nextLevelXp - xp;

  }

  public calcLevel(xp: number): number {

    let i;
    for (i = 100; xp >= i; i += 100) {
      xp -= i;
    }
    return i / 100;

  }

  public calcRequiredXp(level: number): number {

    let xp = 0;
    for (let i = 0; i < level; i++) {
      xp += i * 100;
    }
    return xp;

  }

  public changes(): void {
    this.loadAchievements();
  }

}
