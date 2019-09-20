import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Notification, NotificationType} from '../../entities/notification.entity';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {NotificationsService} from '../../services/notifications.service';
import {interval} from 'rxjs';
import {AuthHelperService} from '../../services/auth-helper.service';
import {ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import icon from 'ol/style/icon';
import {DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'ut-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.less']
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private static SUBSCRIPTION_TAG = 'notifications-cmp';
  private static AUTO_DISMISS_TIMEOUT_MS: number = 10000;
  private static DISMISS_ANIMATION_DURATION_MS: number = 250;
  private static NOTIFICATION_CHECK_INTERVAL_MS: number = 10000;

  public NotificationType = NotificationType;

  public displayNotifications: Array<Notification> = new Array<Notification>();

  @ViewChild('authTimeoutTemplate', {static: true})
  public authTimeoutTemplate: TemplateRef<any>;
  private authTimeoutNotification: Notification;

  constructor(private subs: SubscriptionManagerService,
              private authHelperService: AuthHelperService,
              private notificationsService: NotificationsService,
              private translateService: TranslateService,
              private domSanitizer: DomSanitizer,
              private router: Router,
              private route: ActivatedRoute) { }

  public ngOnInit(): void {

    this.subs.register(this.notificationsService.showNotificationEmitter.subscribe((notification: Notification) => {
      this.showNotification(notification);
    }), NotificationsComponent.SUBSCRIPTION_TAG);

    this.subs.register(this.notificationsService.hideNotificationEmitter.subscribe((notification: Notification) => {
      this.hideNotification(notification);
    }), NotificationsComponent.SUBSCRIPTION_TAG);

    this.subs.register(interval(NotificationsComponent.NOTIFICATION_CHECK_INTERVAL_MS).subscribe(() => {
      this.notificationCheck();
    }), NotificationsComponent.SUBSCRIPTION_TAG);

    this.subs.register(this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.notificationCheck();
      }
    }), NotificationsComponent.SUBSCRIPTION_TAG);

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(NotificationsComponent.SUBSCRIPTION_TAG);
  }

  public showNotification(notification: Notification): void {

    let iconurl;
    switch (notification.type) {
      case NotificationType.levelup:
        iconurl = '/assets/img/level/level-notification.svg';
        break;
      case NotificationType.success:
        iconurl = '/assets/img/special/check-success.svg';
        break;
      case NotificationType.info:
        iconurl = '/assets/img/special/info-info.svg';
        break;
      case NotificationType.warning:
        iconurl = '/assets/img/special/warning-warning.svg';
        break;
      case NotificationType.danger:
        iconurl = '/assets/img/special/cross-danger.svg';
        break;
    }
    notification.iconurl = this.domSanitizer.bypassSecurityTrustResourceUrl(iconurl);
    this.displayNotifications.push(notification);

    if (!notification.indefinite) {
      setTimeout(() => {
        this.hideNotification(notification);
      }, NotificationsComponent.AUTO_DISMISS_TIMEOUT_MS);
    }

  }

  public hideNotification(notification: Notification): void {

    let i = 0, found = false;
    for (let n of this.displayNotifications) {
      if (n === notification) {
        found = true;
        break;
      }
      i++;
    }
    if (found) {
      notification.hide = true;
      setTimeout(() => {
        this.displayNotifications.splice(i, 1);
      }, NotificationsComponent.DISMISS_ANIMATION_DURATION_MS);
    }

  }

  private notificationCheck(): void {

    if (this.authHelperService.shouldShowAuthTimeoutNotification(this.route.firstChild.snapshot)) {
      if (!this.authTimeoutNotification) {
        this.showAuthTimeoutNotification();
      }
    } else if (this.authTimeoutNotification) {
      this.hideNotification(this.authTimeoutNotification);
      this.authTimeoutNotification = null;
    }

  }

  private showAuthTimeoutNotification(): void {

    let n = new Notification(
      this.translateService.instant('notifications.auth_timeout.title'),
      this.translateService.instant('notifications.auth_timeout.subtitle'),
      NotificationType.danger,
      this.authTimeoutTemplate
    );
    n.indefinite = true;
    n.action.subscribe(() => {
      this.notificationsService.showNotification(
        new Notification(
          this.translateService.instant('notifications.auth_timeout.success_title'),
          undefined,
          NotificationType.success
        )
      );
      this.notificationsService.hideNotification(n);
      this.authTimeoutNotification = null;
    });
    this.notificationsService.showNotification(n);
    this.authTimeoutNotification = n;

  }

}
