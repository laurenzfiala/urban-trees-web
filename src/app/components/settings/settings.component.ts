import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EnvironmentService} from '../../services/environment.service';
import {User} from '../../entities/user.entity';
import {AbstractComponent} from '../abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../entities/api-error.entity';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'ut-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Current user.
   */
  public user: User;

  constructor(private envService: EnvironmentService,
              private translateService: TranslateService,
              private userService: UserService,
              private authService: AuthService) {
    super();
  }

  public ngOnInit() {
    this.user = new User(this.authService.getUserId(), this.authService.getUsername());
  }

  public deleteUser() {

    this.user.deleteStatus = StatusValue.IN_PROGRESS;
    this.userService.deleteUser(() => {
      this.user.deleteStatus = StatusValue.SUCCESSFUL;
      this.authService.logout();
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.user.deleteStatus = StatusValue.FAILED;
    });

  }

  get currentLanguage(): string {
    return this.translateService.currentLang ? this.translateService.currentLang : this.translateService.defaultLang;
  }

  get availableLanguages(): Array<string> {
    return this.translateService.getLangs();
  }

  public setLanguage(lang: string) {
    this.translateService.use(lang);
  }

}

export enum StatusKey {

  DELETE_USER

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
