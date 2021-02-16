import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {ApiError} from '../../../shared/entities/api-error.entity';
import {Observable} from 'rxjs';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';

@Component({
  selector: 'ut-loading-status',
  templateUrl: './loading-status.component.html',
  styleUrls: ['./loading-status.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingStatusComponent extends AbstractComponent implements OnInit, OnDestroy {

  private subscriptionTag: string;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public internalError: ApiError;

  @Input()
  public showStatusOutside: boolean = false;

  /**
   * Translation id for text to be displayed while loading.
   */
  @Input()
  public loadingDescription: string;

  /**
   * Translation id for text to be displayed inside the error tooltip.
   */
  @Input()
  public errorDescription: string;

  /**
   * Holds the status value enum object that is used by the
   * external component. This is used for correct lookup of statuses.
   */
  @Input()
  public statusValues: any;

  @Input()
  private status: Observable<number>;

  @Input()
  private error: Observable<ApiError>;

  @Output()
  public retry: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private subs: SubscriptionManagerService) {
    super();
  }

  public ngOnInit() {

    this.update(0);
    this.subscriptionTag = this.subs.tag('loading-status-cmp');
    this.subs.register(this.status.subscribe(value => {
      this.update(value);
    }), this.subscriptionTag);

    this.subs.register(this.error.subscribe(value => {
      if (!value) {
        return;
      }
      this.internalError = value;
    }), this.subscriptionTag);

  }

  /**
   * Update the internal status for the given external one.
   * Uses the given statusValues to determine the status.
   * @param statusEnumValue external enum value
   * @see statusValues
   */
  private update(statusEnumValue: number): void {

    const inProgressValue: number = this.statusValues['IN_PROGRESS'];
    const successfulValue: number = this.statusValues['SUCCESSFUL'];
    const failedValue: number = this.statusValues['FAILED'];

    switch (statusEnumValue) {
      case inProgressValue:
        this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.IN_PROGRESS);
        break;
      case successfulValue:
        this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.SUCCESSFUL);
        break;
      case failedValue:
        this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.FAILED);
        break;
      default:
        this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.UNDEFINED);
    }

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(this.subscriptionTag);
  }

}

export enum StatusKey {

  EXTERNAL_STATUS,
  ERROR_REPORT

}

export enum StatusValue {

  UNDEFINED,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
