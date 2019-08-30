import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {Log} from '../../services/log.service';
import {TranslateService} from '@ngx-translate/core';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';

@Component({
  selector: 'ut-beacon-select',
  templateUrl: './beacon-select.component.html',
  styleUrls: ['../tree-list/tree-list.component.less', './beacon-select.component.less']
})
export class BeaconSelectComponent extends AbstractComponent {

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
  @Input()
  public preselectFirstBeacon: boolean = false;

  /**
   * Once loaded, contains all trees available for observation.
   */
  private availableBeaconsInternal: Array<BeaconFrontend>;

  @Input() set availableBeacons(value: Array<BeaconFrontend>) {
    this.availableBeaconsInternal = value;
    this.setDisplayBeaconsPaginated(value);
    if ((!this.selectedBeacon || this.selectedBeacon.id === 0) && this.preselectFirstBeacon && this.availableBeaconsInternal.length >= 1) {
      this.toggleSelect(this.availableBeaconsInternal[0].id);
    } else if (this.selectedBeacon) {
      this.toggleSelect(this.selectedBeacon.id);
    }
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
   * Current tree search input.
   */
  public searchInput: string;

  constructor(public translateService: TranslateService) {
    super();
  }

  /**
   * Set the #displayBeacons array using the correct pagination.
   * @param {Array<TreeFrontend>} beacons the filtered beacons to display.
   */
  private setDisplayBeaconsPaginated(beacons: Array<BeaconFrontend>) {

    if (!this.availableBeaconsInternal) {
      return;
    }

    const minPageSize = 6;
    const pages = 5;
    let pageSize = Math.ceil(this.availableBeaconsInternal.length / pages);

    if (pageSize < minPageSize) {
      pageSize = minPageSize;
    }

    if (beacons.length <= pageSize) {
      this.displayPagination = false;
    } else {
      this.displayPagination = true;
    }

    let paginatedArray = new Array<Array<BeaconFrontend>>();

    let page = 0;
    for (let i = 0; i < beacons.length; i += pageSize) {
      pageSize = i >= beacons.length ? i - beacons.length : pageSize;
      paginatedArray[page] = beacons.slice(i, i + pageSize);
      page++;
    }

    this.currentDisplayPage = 0;
    this.displayBeacons = paginatedArray;

  }


  /**
   * Set tree search and filter displayed trees by input.
   * @param {string} searchInput user's tree search input
   */
  public setSearchInput(searchInput: string): void {

    if (!searchInput) {
      this.setDisplayBeaconsPaginated(this.availableBeaconsInternal);
      return;
    }

    const idInput = Number(searchInput);
    if (!Number.isNaN(idInput)) {
      this.setDisplayBeaconsPaginated(this.availableBeaconsInternal.filter((beacon: BeaconFrontend) => {
        return beacon.id === idInput;
      }));
      return;
    }

    this.setDisplayBeaconsPaginated(
      this.availableBeaconsInternal.filter((beacon: BeaconFrontend) => {
        if (!searchInput) {
          return false;
        }
        return searchInput.indexOf(beacon.deviceId) !== -1;
      })
    );

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

}

export enum StatusKey {

  BEACONS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
