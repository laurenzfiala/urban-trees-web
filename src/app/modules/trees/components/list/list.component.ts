import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {LoadingStatusComponent} from '../loading-status/loading-status.component';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {PhenologyDatasetWithTree} from '../../entities/phenology-dataset-with-tree.entity';
import * as moment from 'moment';
import {environment} from '../../../../../environments/environment';
import {Moment} from 'moment';

@Component({
  selector: 'ut-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less']
})
export class ListComponent extends LoadingStatusComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input()
  public itemTemplate: TemplateRef<any>;

  @Input()
  set items(items: Array<any>) {
    if (this.categorizer) {
      this._items = null;
      this.updateItemCategories(items);
    } else {
      this._items = items;
    }
    this.itemsChanged = true;
  }

  @Input()
  public categorizer: (item: any) => string;

  @ViewChild('listScrollEl')
  public listScrollEl: ElementRef<HTMLDivElement>;

  private _items: Array<any>;
  public itemCategories: Map<string, Array<any>>;
  private itemsChanged: boolean = false;
  public scrollBtns: { right: boolean, left: boolean };

  constructor(private subs2: SubscriptionManagerService,
              private cdRef: ChangeDetectorRef) {
    super(subs2);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngAfterViewChecked(): void {
    if (this.itemsChanged) {
      this.itemsChanged = false;
      this.updateScrollBtns();
      this.cdRef.detectChanges();
    }
  }

  public updateScrollBtns(): void {
    this.scrollBtns = {
      right: this.showScrollBtn('right'),
      left: this.showScrollBtn('left')
    };
    this.cdRef.markForCheck();
    console.log('update');
  }

  private showScrollBtn(type: 'right' | 'left'): boolean {

    if (!this.listScrollEl) {
      return false;
    }

    const el = this.listScrollEl.nativeElement;
    if (type === 'left') {
      return el.scrollLeft > 0;
    } else if (type === 'right') {
      return el.scrollLeft < el.scrollWidth - el.clientWidth;
    }
    return false;

  }

  public scrollList(type: 'right' | 'left'): void {

    const el = this.listScrollEl.nativeElement;
    const scrollBy = el.clientWidth * 0.9;

    el.scrollLeft += scrollBy * (type === 'right' ? 1 : -1);

  }

  private updateItemCategories(items: Array<any>): void {

    this.itemCategories = new Map<string, Array<any>>();

    for (let item of items) {
      const category = this.categorizer(item);
      const categoryItems = this.itemCategories.get(category);
      if (categoryItems === undefined) {
        this.itemCategories.set(category, [item]);
      } else {
        categoryItems.push(item);
      }
    }

  }

  public ngOnDestroy() {
    super.ngOnDestroy();
  }

  get items(): Array<any> {
    return this._items;
  }

  public isEmpty(): boolean {
    return (!this.itemCategories || this.itemCategories.size === 0)
           && (!this.items || this.items.length === 0);
  }

  public static historyCategorizer(date: Moment): string {

    let timeCategory = 'unknown';
    if (date.isAfter(moment().startOf('day'))) {
      timeCategory = 'today';
    } else if (date.isAfter(moment().add(-1, 'day').startOf('day'))) {
      timeCategory = 'yesterday';
    } else if (date.isAfter(moment().startOf('week'))) {
      timeCategory = 'this_week';
    } else if (date.isAfter(moment().startOf('month'))) {
      timeCategory = 'this_month';
    } else if (date.isAfter(moment().add(-1, 'month').startOf('month'))) {
      timeCategory = 'last_month';
    } else {
      const d = moment().startOf('year');
      for (let i = 0; i < 5; i++) {
        if (date.isAfter(d)) {
          return d.year() + '';
        }
        d.add(-1, 'year');
      }
      return 'more_than_5_years_ago';
    }
    return 'time.category.' + timeCategory;

  }

}
