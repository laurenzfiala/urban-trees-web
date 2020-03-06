import {EventEmitter, Injectable} from '@angular/core';
import {Notification} from '../entities/notification.entity';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  public showNotificationEmitter: EventEmitter<Notification> = new EventEmitter<Notification>();
  public hideNotificationEmitter: EventEmitter<Notification> = new EventEmitter<Notification>();

  public notifications: Array<Notification> = new Array<Notification>();

  constructor() { }

  public showNotification(notification: Notification): void {

    this.notifications.push(notification);
    this.showNotificationEmitter.emit(notification);

  }

  public hideNotification(notification: Notification): void {

    let i = 0, found = false;
    for (let n of this.notifications) {
      if (n === notification) {
        found = true;
        break;
      }
      i++;
    }
    notification.dismiss.next();
    if (found) {
      this.notifications.splice(i, 1);
    }
    this.hideNotificationEmitter.emit(notification);
  }

}
