import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
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

  private static SUBSCRIPTION_TAG = 'loading-status-cmp';

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

    this.subs.register(this.status.subscribe(value => {
      switch (value) {
        case 0:
          this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.IN_PROGRESS);
          break;
        case 1:
          this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.SUCCESSFUL);
          break;
        case 2:
          this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.FAILED);
          break;
        default:
          this.setStatus(StatusKey.EXTERNAL_STATUS, StatusValue.UNDEFINED);
      }
    }), LoadingStatusComponent.SUBSCRIPTION_TAG);

    this.subs.register(this.error.subscribe(value => {
      if (!value) {
        return;
      }
      this.internalError = value;
    }), LoadingStatusComponent.SUBSCRIPTION_TAG);

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(LoadingStatusComponent.SUBSCRIPTION_TAG);
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
