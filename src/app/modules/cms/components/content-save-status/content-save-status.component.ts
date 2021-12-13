import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, timer} from 'rxjs';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {CmsContent} from '../../entities/cms-content.entity';
import {StatusKey, StatusValue} from '../content/content.component';
import * as moment from 'moment';
import {Log} from '../../../shared/services/log.service';

@Component({
  selector: 'ut-content-save-status',
  templateUrl: './content-save-status.component.html',
  styleUrls: ['./content-save-status.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubscriptionManagerService]
})
export class ContentSaveStatusComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ContentSaveStatusComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private saveTimerSubscriptionTag: string;

  @Input()
  private status: Observable<StatusValue>;

  @Input()
  private saved: Observable<CmsContent>;

  /**
   * Data for the save timer.
   */
  public saveTimer: {content: CmsContent, msgKey: string, durationSinceSave: any} = {content: undefined, msgKey: undefined, durationSinceSave: undefined};

  constructor(private subs: SubscriptionManagerService,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit() {

    this.saveTimerSubscriptionTag = undefined;
    this.updateStatus(StatusValue.NONE);
    this.subs.reg(this.status.subscribe(status => this.updateStatus(status)));
    this.subs.reg(this.saved.subscribe(savedContent => this.startSaveTimer(savedContent)));

  }

  private updateStatus(status: StatusValue): void {
    this.setStatus(StatusKey.SAVE, status);
    this.cdRef.markForCheck();
  }

  private startSaveTimer(savedContent: CmsContent): void {

    this.saveTimer.content = savedContent;

    if (this.saveTimerSubscriptionTag) {
      this.subs.unsubscribe(this.saveTimerSubscriptionTag);
    }
    this.saveTimerSubscriptionTag = this.subs.tag('savetimer');
    this.subs.register(
      timer(0, 1000).subscribe(value => {

        const saveDate = moment.utc(this.saveTimer.content.saved);
        if (!saveDate) {
          return;
        }

        this.saveTimer.durationSinceSave = moment.duration(moment().diff(saveDate));

        const now = moment();
        let key;
        if (saveDate.isAfter(now.clone().subtract(20, 'second'))) {
          key = 'last_saved_moments_ago';
        } else if (saveDate.isAfter(now.clone().subtract(1, 'minute'))) {
          key = 'last_saved_less_than_minute_ago';
        } else if (saveDate.isAfter(now.clone().subtract(2, 'minute'))) {
          key = 'last_saved_minute_ago';
        } else if (saveDate.isAfter(now.clone().subtract(1, 'hour'))) {
          key = 'last_saved_minutes_ago';
        } else {
          key = 'last_saved_more_than_hour_ago';
        }
        this.saveTimer.msgKey = 'toolbar.save.' + key;

        this.cdRef.markForCheck();

      }),
      this.saveTimerSubscriptionTag
    );

  }

  ngOnDestroy() {
    this.subs.unsubAll();
  }

}
