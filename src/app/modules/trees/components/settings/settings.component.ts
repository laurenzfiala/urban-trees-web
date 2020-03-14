import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {User} from '../../entities/user.entity';
import {AbstractComponent} from '../abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../shared/entities/api-error.entity';
import {UserService} from '../../services/user.service';
import {AuthService} from '../../../shared/services/auth.service';

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

  get ppin(): string {
    return this.authService.getPPIN();
  }

  constructor(public envService: EnvironmentService,
              private translateService: TranslateService,
              private userService: UserService,
              private authService: AuthService) {
    super();
  }

  public ngOnInit() {

    this.user = new User(this.authService.getUserId(), this.authService.getUsername());
    if (!this.authService.isUserAnonymous() && this.authService.getPPIN() === undefined) {
      this.requestPPIN();
    } else {
      this.setStatus(StatusKey.PPIN, StatusValue.SUCCESSFUL);
    }

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

  /**
   * Request a new permissions PIN from backend.
   */
  public requestPPIN(): void {

    this.setStatus(StatusKey.PPIN, StatusValue.IN_PROGRESS);
    this.authService.loadPPIN((ppin: string) => {
      this.setStatus(StatusKey.PPIN, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.PPIN, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  DELETE_USER,
  PPIN,
  PPIN_USED

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  SHOW

}
