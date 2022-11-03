import {Component, OnInit} from '@angular/core';
import {AnnouncementService} from '../../services/announcement.service';
import {AuthService} from '../../../shared/services/auth.service';
import {LoginAccessReason} from '../project-login/logout-reason.enum';
import {Announcement} from '../../entities/announcement.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {UserService} from '../../services/user.service';
import {UserData} from '../../entities/user-data.entity';
import {ActivatedRoute} from '@angular/router';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {LayoutConfig} from '../../config/layout.config';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';

@Component({
  selector: 'ut-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {

  private static SUBSCRIPTION_TAG = 'header-cmp';

  public small: boolean = false;

  get userdata(): UserData {
    return this.userService.getUserData();
  }

  constructor(private announcementService: AnnouncementService,
              public authService: AuthService,
              public userService: UserService,
              public envService: EnvironmentService,
              private bpObserver: BreakpointObserver,
              private subs: SubscriptionManagerService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.announcementService.load();

    this.subs.register(this.bpObserver.observe(LayoutConfig.LAYOUT_MEDIA_STEPS)
      .subscribe((state: BreakpointState) => {
        this.small = state.breakpoints[LayoutConfig.LAYOUT_MEDIA_XS] ||
            state.breakpoints[LayoutConfig.LAYOUT_MEDIA_SM];
      }), HeaderComponent.SUBSCRIPTION_TAG);
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

  public focusHeader(): void {
    document.getElementById('firstHeaderLink').focus();
  }

  public focusContent(): void {
    (document
      .querySelector('#content')
      .querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex=\'-1\'])') as HTMLElement)
      .focus();
  }

  public focusFooter(): void {
    document.getElementById('firstFooterLink').focus();
  }

  get announcements() {
    return this.announcementService.getAnnouncements();
  }

  get navKey() {
    return this.activatedRoute.snapshot.firstChild.data.navKey;
  }

}
