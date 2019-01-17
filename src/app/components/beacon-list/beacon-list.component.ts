import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BeaconData} from "../../entities/beacon-data.entity";
import {TreeFrontend} from "../../entities/tree-frontend.entity";
import {AbstractComponent} from "../abstract.component";
import {TreeService} from "../../services/tree.service";
import {Beacon} from '../../entities/beacon.entity';
import {BeaconSettings} from '../../entities/beacon-settings.entity';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {AdminService} from '../../services/admin/admin.service';
import {BeaconDataMode} from '../../entities/beacon-data-mode.entity';

@Component({
  selector: 'ut-beacon-list',
  templateUrl: './beacon-list.component.html',
  styleUrls: ['./beacon-list.component.less']
})
export class BeaconListComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private treeInternal: TreeFrontend;

  @Input()
  set tree(tree: TreeFrontend) {
    this.treeInternal = tree;
    this.loadBeaconData();
  }

  get tree(): TreeFrontend {
    return this.treeInternal;
  }

  @Input()
  public showData: boolean = true;

  @Input()
  public modify: boolean = false;

  @Input()
  public preselectDeviceId: string;

  @Output('addBeacon')
  public addBeacon: EventEmitter<boolean> = new EventEmitter<boolean>();

  public BeaconDataMode = BeaconDataMode;
  public BEACON_DATA_MODE_KEYS: string[] = Object.keys(BeaconDataMode);

  public currentBeaconDataMode: BeaconDataMode = BeaconDataMode.LAST_WEEK;
  public maxDatapoints: number = 10000;

  // color scheme for charts
  public colorScheme: any;

  constructor(private treeService: TreeService,
              private adminService: AdminService) {
    super();
  }

  ngOnInit() {
    this.setStatus(StatusKey.REMOVE_BEACON, StatusValue.PENDING);
    this.loadBeaconData();
  }


  public loadBeaconData(mode?: BeaconDataMode, forceRefresh?: boolean): void {

    if (mode !== undefined) {
      this.currentBeaconDataMode = mode;
    }
    this.updateChartColorScheme();

    if (!this.tree || !this.tree.beacons) {
      return;
    }

    for (let beacon of this.tree.beacons) {

      this.setStatus(StatusKey.BEACON_DATA, 0);
      if (this.showData) {
        this.loadBeaconDataInternal(beacon);
      }
      if ((this.modify && !beacon.settings) || forceRefresh) {
        this.loadBeaconSettings(beacon);
      }

    }

  }

  /**
   * Reload beacon data even if its already loaded.
   */
  public refresh(): void {
    this.loadBeaconData(undefined, true);
  }

  /**
   * Load the chart data for the given beacon.
   */
  private loadBeaconDataInternal(beacon: BeaconFrontend): void {

    this.treeService.loadBeaconData(beacon.id, this.maxDatapoints, this.currentBeaconDataMode, (beaconData: Array<BeaconData>) => {
      beacon.datasets = beaconData;
      beacon.populateChartData(this.currentBeaconDataMode);
      this.setStatus(StatusKey.BEACON_DATA, this.getStatus(StatusKey.BEACON_DATA) + 1);
    }, (error, apiError) => {
      this.setStatus(StatusKey.BEACON_DATA, StatusValue.FAILED);
    });

  }

  /**
   * Load the beacon settings for the given beacon.
   * @param beacon
   */
  private loadBeaconSettings(beacon: Beacon): void {

    this.setStatus(StatusKey.BEACON_SETTINGS, StatusValue.IN_PROGRESS);
    this.treeService.loadBeaconSettings(beacon.id, (beaconSettings: BeaconSettings) => {
      beacon.settings = beaconSettings;
      this.setStatus(StatusKey.BEACON_SETTINGS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.BEACON_SETTINGS, StatusValue.FAILED);
    });

  }

  /**
   * Emit add beacon signal for the containing component.
   */
  public onAddBeaconClick(): void {
    this.addBeacon.emit(true);
  }

  /**
   * Emit remove beacon signal for the containing component.
   */
  public onRemoveBeaconClick(beacon: Beacon): void {

    this.setStatus(StatusKey.REMOVE_BEACON, StatusValue.IN_PROGRESS);
    this.adminService.deleteBeacon(beacon.id, () => {
      this.setStatus(StatusKey.REMOVE_BEACON, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.REMOVE_BEACON, StatusValue.FAILED);
    });

  }

  /**
   * If #preselectDeviceId is set, return true if the given beacon
   * matches the deviceId set.
   * If it's unset, preselect the first beacon.
   * @see preselectDeviceId
   */
  public isTabActive(beacon: Beacon): boolean {

    if (this.preselectDeviceId) {
      return beacon.deviceId === this.preselectDeviceId;
    } else {
      this.preselectDeviceId = beacon.deviceId;
      return true;
    }

  }

  private updateChartColorScheme(): any {

    switch (this.currentBeaconDataMode) {
      case BeaconDataMode.LAST_24H:
      case BeaconDataMode.LAST_WEEK:
        this.colorScheme = {
          domain: ['#5AA454', '#A10A28', '#C7B42C']
        };
        break;
      case BeaconDataMode.TEMP_LAST_MONTH_PER_DAY:
      case BeaconDataMode.HUMI_LAST_MONTH_PER_DAY:
        this.colorScheme = {
          domain: ['#3e4da4', '#82a191', '#c79855']
        };
        break;
    }

  }

}

export enum StatusKey {

  BEACON_DATA,
  BEACON_SETTINGS,
  REMOVE_BEACON

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED = -1

}
