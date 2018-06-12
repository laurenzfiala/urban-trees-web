import { Component, OnInit } from '@angular/core';
import {AnnouncementService} from '../../services/announcement.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '../../services/auth.service';
import {LogoutReason} from '../project-login/logout-reason.enum';

@Component({
  selector: 'ut-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  constructor(private announcementService: AnnouncementService,
              private translateService: TranslateService,
              private authService: AuthService) { }

  ngOnInit() {
    this.announcementService.load();
  }

  /**
   * Log the user out and redirects to login page.
   */
  public logout(): void {
    this.authService.logout();
    this.authService.redirectToLogin(LogoutReason.USER_LOGOUT);
  }

  /**
   * Log the user out and redirects to login page.
   */
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get announcements() {
    return this.announcementService.getAnnouncements();
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
