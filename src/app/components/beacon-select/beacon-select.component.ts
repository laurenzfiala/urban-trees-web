import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {Log} from '../../services/log.service';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {EnvironmentService} from '../../services/environment.service';
import {SearchService} from '../../services/search.service';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {LayoutConfig} from '../../config/layout.config';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

@Component({
  selector: 'ut-beacon-select',
  templateUrl: './beacon-select.component.html',
  styleUrls: ['../tree-list/tree-list.component.less', './beacon-select.component.less']
})
export class BeaconSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static SUBSCRIPTION_TAG = 'beacon-select';

  private static LOG: Log = Log.newInstance(BeaconSelectComponent);

  /**
   * Event emitter triggered upon (de-)selecting a new/different tree.
   * Deselecting emits null.
   */
  @Output()
  public selectedBeaconChange: EventEmitter<BeaconFrontend> = new EventEmitter<BeaconFrontend>();

  /**
   * Holds the currently selected tree.
   */
  @Input()
  public selectedBeacon: BeaconFrontend;

  /**
   * Wheter or not to preselect the first beacon in the list.
   * Input "selectedBeacon" overrides this if it has an id != 0 and is non-falsy.
   */
  public preselectFirstBeaconInternal: boolean = false;

  /**
  * @see BeaconSelectComponent.preselectFirstBeaconInternal
  */
  @Input() set preselectFirstBeacon(value: boolean) {
    this.preselectFirstBeaconInternal = value;
    this.updateSelectedBeacon();
  }

  get preselectFirstBeacon(): boolean {
    return this.preselectFirstBeaconInternal;
  }

  /**
   * Once loaded, contains all trees available for observation.
   */
  private availableBeaconsInternal: Array<BeaconFrontend>;

  @Input() set availableBeacons(value: Array<BeaconFrontend>) {
    this.availableBeaconsInternal = value;
    this.updateSelectedBeacon();
    this.update(false);
  }

  get availableBeacons(): Array<BeaconFrontend> {
    return this.availableBeaconsInternal;
  }

  /**
   * Whether to allow deselecting selected trees.
   */
  @Input()
  public allowDeselect: boolean = false;

  /**
   * Trees currently displayed.
   */
  public displayBeacons: Array<Array<BeaconFrontend>>;

  /**
   * Whether or not to display the tree list pagination.
   */
  public displayPagination: boolean;

  /**
   * Page index to display.
   */
  public currentDisplayPage: number = 0;

  /**
   * Amount of pages to display.
   */
  public currentDisplayPages: number = 0;

  /**
   * Current tree search input.
   */
  public searchInput: string;

  /**
   * Current pagination page size.
   */
  private pageSize: number;

  constructor(private envService: EnvironmentService,
              private searchService: SearchService,
              private subs: SubscriptionManagerService,
              private bpObserver: BreakpointObserver) {
    super();
  }

  public ngOnInit(): void {

    this.subs.register(this.bpObserver.observe(LayoutConfig.LAYOUT_MEDIA_STEPS).subscribe((state: BreakpointState) => {
      let pageSize = 2;
      if (state.breakpoints[LayoutConfig.LAYOUT_MEDIA_MD]) {
        pageSize = 4;
      } else if (state.breakpoints[LayoutConfig.LAYOUT_MEDIA_LG] || state.breakpoints[LayoutConfig.LAYOUT_MEDIA_XL]) {
        pageSize = 6;
      }
      this.pageSize = pageSize;
      this.update(false);
    }), BeaconSelectComponent.SUBSCRIPTION_TAG);

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(BeaconSelectComponent.SUBSCRIPTION_TAG);
  }

  /**
   * Set the #displayBeacons array using the correct pagination.
   * @param {Array<TreeFrontend>} beacons the filtered beacons to display.
   */
  private setDisplayBeaconsPaginated(beacons: Array<BeaconFrontend>) {

    if (!this.availableBeaconsInternal || !this.pageSize) {
      return;
    }

    this.currentDisplayPages = Math.ceil(beacons.length / this.pageSize);
    this.displayPagination = beacons.length > this.pageSize;

    let paginatedArray = new Array<Array<BeaconFrontend>>();

    let page = 0;
    for (let i = 0; i < beacons.length; i += this.pageSize) {
      paginatedArray[page] = beacons.slice(i, i + this.pageSize);
      page++;
    }

    if (this.selectedBeacon) {
      const selectedIndex = beacons.findIndex(value => value.id === this.selectedBeacon.id);
      if (selectedIndex === -1) {
        this.currentDisplayPage = 0;
      } else {
        this.currentDisplayPage = Math.floor( selectedIndex / this.pageSize);
      }
    } else {
      this.currentDisplayPage = 0;
    }
    this.displayBeacons = paginatedArray;

  }


  /**
   * Set tree search and filter displayed trees by input.
   * @param {boolean} debounce (optional) whether to wait a few ms if a new input is given
   */
  public update(debounce: boolean = true): void {

    const searchInput = this.searchInput;
    if (!searchInput) {
      this.setDisplayBeaconsPaginated(this.availableBeaconsInternal);
      return;
    }

    let fn = () => {
      if (this.searchInput !== searchInput) {
        return;
      }
      this.searchService.search(this.availableBeaconsInternal, searchInput, 'beacon-select', undefined, 2).then(results => {
        this.setDisplayBeaconsPaginated(results);
      });
    };

    if (debounce) {
      // debounce search input (for improved performance)
      setTimeout(fn, this.envService.searchDebounceMs);
    } else {
      fn();
    }

  }

  /**
   * Change the currently displayed list page.
   * @param {number} displayIndex index to display.
   */
  public displayPage(displayIndex: number): void {

    if (displayIndex < 0 || displayIndex >= this.displayBeacons.length) {
      return;
    }
    this.currentDisplayPage = displayIndex;

  }

  /**
   * Select or deselect a single beacon to continue observation.
   * @param {number} id id of that beacon
   */
  public toggleSelect(id: number) {

    if (this.availableBeaconsInternal === undefined) {
      return;
    }

    const newSelection = this.availableBeaconsInternal.find(value => value.id === id);
    if (this.allowDeselect && newSelection === this.selectedBeacon) {
      this.selectedBeacon = null;
    } else {
      this.selectedBeacon = newSelection;
    }

    this.selectedBeaconChange.emit(this.selectedBeacon);

  }

  /**
   * Updates the selected beacon if the availableBeacons array changes or
   * preselectFirstBeacon is changed.
   */
  private updateSelectedBeacon(): void {

    if ((!this.selectedBeacon || this.selectedBeacon.id === 0) && this.preselectFirstBeacon && this.availableBeaconsInternal.length >= 1) {
      this.toggleSelect(this.availableBeaconsInternal[0].id);
    } else if (this.selectedBeacon) {
      this.toggleSelect(this.selectedBeacon.id);
    }

  }

}

export enum StatusKey {

  BEACONS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
