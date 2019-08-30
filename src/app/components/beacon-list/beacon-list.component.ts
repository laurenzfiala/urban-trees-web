import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BeaconData} from '../../entities/beacon-data.entity';
import {AbstractComponent} from '../abstract.component';
import {TreeService} from '../../services/tree.service';
import {BeaconSettings} from '../../entities/beacon-settings.entity';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {AdminService} from '../../services/admin/admin.service';
import {BeaconDataMode} from '../../entities/beacon-data-mode.entity';
import {BeaconLogSeverity} from '../../entities/BeaconLogSeverity';
import {BeaconLog} from '../../entities/beacon-log.entity';
import {TranslateService} from '@ngx-translate/core';
import {BeaconStatus} from '../../entities/beacon-status.entity';

@Component({
  selector: 'ut-beacon-list',
  templateUrl: './beacon-list.component.html',
  styleUrls: ['./beacon-list.component.less']
})
export class BeaconListComponent extends AbstractComponent implements OnInit {

  private static EFFECTIVE_BATTERY_CAPACITY: number = 30;
  public static BEACON_LOGS_PAGE_SIZE: number = 25;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public BeaconStatus = BeaconStatus;

  private beaconsInternal: Array<BeaconFrontend>;
  private selectedBeaconIndex: number = 0;

  @Input()
  set beacons(beacons: Array<BeaconFrontend>) {
    this.beaconsInternal = beacons;
    if (!this.selectedBeacon) {
      this.selectedBeaconIndex = 0;
    }
    this.loadBeaconData();
  }

  get beacons(): Array<BeaconFrontend> {
    return this.beaconsInternal;
  }

  get selectedBeacon(): BeaconFrontend {
    if (!this.beaconsInternal) {
      return null;
    }
    return this.beaconsInternal[this.selectedBeaconIndex];
  }

  @Input()
  public showData: boolean = true;

  @Input()
  public modify: boolean = false;

  @Input()
  public showAssociations: boolean = false;

  @Input()
  public preselectDeviceId: string;

  public BeaconDataMode = BeaconDataMode;
  public BEACON_DATA_MODE_KEYS: string[] = Object.keys(BeaconDataMode);

  public BeaconLogSeverity = BeaconLogSeverity;
  public BEACON_LOG_SEVERITY: string[] = Object.keys(BeaconLogSeverity);
  public selectedMinLogSeverity: BeaconLogSeverity = BeaconLogSeverity.TRACE;

  public currentBeaconDataMode: BeaconDataMode = BeaconDataMode.LAST_24H;
  public maxDatapoints: number = 10000;

  // color scheme for charts
  public colorScheme: any;

  constructor(private treeService: TreeService,
              private adminService: AdminService,
              private translateService: TranslateService) {
    super();
  }

  ngOnInit() {
    this.preSelectDevice(this.preselectDeviceId);
    this.loadBeaconData();
  }

  /**
   * Given battery level by device is percent of voltage and not actual battery level.
   * We assume 70% of voltage is the minimum.
   * @see https://www.bluemaestro.com/wp-content/uploads/2016/11/Temperature-Humidity-Data-Logger-Commands-API-2.4.pdf (p.9)
   * @param actualBattLvl battery level from device/db
   * @return number from 0-100
   */
  public calcEffectiveBatteryLevel(actualBattLvl: number): number {
    return Math.max(0, Math.floor(
      (actualBattLvl - 100 + BeaconListComponent.EFFECTIVE_BATTERY_CAPACITY)
      / BeaconListComponent.EFFECTIVE_BATTERY_CAPACITY * 100
    ));
  }

  /**
   * Select given device.
   */
  private preSelectDevice(deviceName: string): void {

    if (!deviceName) {
      return;
    }

    let i = 0;
    for (let b of this.beacons) {
      if (b.deviceId === deviceName) {
        this.selectedBeaconIndex = i;
        return;
      }
      i++;
    }

  }

  public loadBeaconData(mode?: BeaconDataMode, forceRefresh?: boolean): void {

    if (mode !== undefined) {
      this.currentBeaconDataMode = mode;
    }
    this.updateChartColorScheme();

    if (!this.beacons) {
      return;
    }

    const beacon = this.selectedBeacon;
    if (!beacon) {
      return;
    }

    this.setStatus(StatusKey.BEACON_DATA, StatusValue.PENDING);
    if (this.showData) {
      this.loadBeaconDataInternal(beacon);
    }
    if ((this.modify && !beacon.settings) || forceRefresh) {
      this.loadBeaconSettings(beacon);
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

    this.setStatus(StatusKey.BEACON_DATA, StatusValue.IN_PROGRESS);
    this.treeService.loadBeaconData(beacon.id, this.maxDatapoints, this.currentBeaconDataMode, (beaconData: Array<BeaconData>) => {
      beacon.datasets = beaconData;
      beacon.populateChartData(this.currentBeaconDataMode, this.translateService);
      this.setStatus(StatusKey.BEACON_DATA, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.BEACON_DATA, StatusValue.FAILED);
    });

  }

  /**
   * Load the beacon settings for the given beacon.
   * @param beacon
   */
  private loadBeaconSettings(beacon: BeaconFrontend): void {

    if (beacon.settingsLoadingStatus === StatusValue.SUCCESSFUL ||
        beacon.settingsLoadingStatus === StatusValue.IN_PROGRESS) {
      return;
    }

    beacon.settingsLoadingStatus = StatusValue.IN_PROGRESS;
    this.treeService.loadBeaconSettings(beacon.id, (beaconSettings: BeaconSettings) => {
      beacon.settings = beaconSettings;
      beacon.settingsLoadingStatus = StatusValue.SUCCESSFUL;
    }, (error, apiError) => {
      beacon.settingsLoadingStatus = StatusValue.FAILED;
    });

  }

  /**
   * Load beacon logs, but only if none are already loaded.
   */
  public loadBeaconLogsInitial(beacon: BeaconFrontend): void {
    if (beacon.logs.length === 0) {
      this.loadBeaconLogs(beacon);
    }
  }

  /**
   * Load the logs for the given beacon.
   * @param beacon
   */
  public loadBeaconLogs(beacon: BeaconFrontend): void {

    beacon.logLoadingStatus = StatusValue.IN_PROGRESS;
    this.adminService.loadBeaconLogs(
      beacon.id,
      this.selectedMinLogSeverity,
      beacon.logs.length,
      BeaconListComponent.BEACON_LOGS_PAGE_SIZE,
      (logs: Array<BeaconLog>) => {
        beacon.canShowMoreLogs = logs.length >= BeaconListComponent.BEACON_LOGS_PAGE_SIZE;
        beacon.logs.push(...logs);
        beacon.logLoadingStatus = StatusValue.SUCCESSFUL;
        beacon.isLogsShown = true;
      }, (error, apiError) => {
        beacon.logLoadingStatus = StatusValue.FAILED;
        if (beacon.logs.length === 0) {
          beacon.isLogsShown = false;
        }
    });

  }

  public setBeaconLogSeverity(severity: BeaconLogSeverity): void {
    this.selectedMinLogSeverity = severity;
    for (let beacon of this.beacons) {
      beacon.logs = [];
      if (beacon.isLogsShown) {
        this.loadBeaconLogsInitial(beacon);
      }
    }
  }

  /**
   * Emit remove beacon signal for the containing component.
   */
  public onRemoveBeaconClick(beacon: BeaconFrontend): void {

    beacon.deleteStatus = StatusValue.IN_PROGRESS;
    this.adminService.deleteBeacon(beacon.id, () => {
      beacon.deleteStatus = StatusValue.SUCCESSFUL;
    }, (error, apiError) => {
      beacon.deleteStatus = StatusValue.FAILED;
    });

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

  BEACON_DATA

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  PENDING = 3

}
