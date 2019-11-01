import { Component, OnInit } from '@angular/core';
import {AnnouncementService} from '../../services/announcement.service';
import {AuthService} from '../../services/auth.service';
import {LoginAccessReason} from '../project-login/logout-reason.enum';
import {Announcement} from '../../entities/announcement.entity';
import {EnvironmentService} from '../../services/environment.service';
import {UserService} from '../../services/user.service';
import {UserData} from '../../entities/user-data.entity';
import * as $ from 'jquery';

@Component({
  selector: 'ut-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  public $ = $;
  public document = document;

  get userdata(): UserData {
    return this.userService.getUserData();
  }

  constructor(private announcementService: AnnouncementService,
              public authService: AuthService,
              public userService: UserService,
              public envService: EnvironmentService) { }

  ngOnInit() {
    this.announcementService.load();
  }

  /**
   * Log the user out and redirects to login page.
   */
  public logout(): void {
    this.authService.logout();
    this.authService.redirectToLogin(LoginAccessReason.USER_LOGOUT);
  }

  /**
   * Log the user out and redirects to login page.
   */
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public hideAnnoucement(annoucement: Announcement) {
    this.announcements.splice(this.announcements.indexOf(annoucement), 1);
  }

  get announcements() {
    return this.announcementService.getAnnouncements();
  }

}
