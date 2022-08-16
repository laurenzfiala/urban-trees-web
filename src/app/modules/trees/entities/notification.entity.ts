/**
 * Notification data for a single notification.
 *
 * @author Laurenz Fiala
 * @since 2019/09/19
 */
import {EventEmitter, TemplateRef} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';

export class Notification {

  public title: string;
  public subtitle: string;
  public iconurl: SafeResourceUrl;
  public icontext: string;
  public type: NotificationType;
  public content: TemplateRef<any>;
  public dismissable: boolean = true;
  public indefinite: boolean = false;
  public hide: boolean = false;
  public dismiss: EventEmitter<any> = new EventEmitter<any>();
  public action: EventEmitter<any> = new EventEmitter<any>();

  constructor(title?: string,
              subtitle?: string,
              type: NotificationType = NotificationType.none,
              content?: TemplateRef<any>,
              dismissable: boolean = true) {
    this.title = title;
    this.subtitle = subtitle;
    this.type = type;
    this.content = content;
    this.dismissable = dismissable;
  }

}

export enum NotificationType {
  none,
  info,
  success,
  warning,
  danger,
  levelup
}
