import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BeaconData} from '../../entities/beacon-data.entity';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {TreeService} from '../../services/tree.service';
import {BeaconSettings} from '../../entities/beacon-settings.entity';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {AdminService} from '../../services/admin/admin.service';
import {BeaconDataMode} from '../../entities/beacon-data-mode.entity';
import {BeaconLogSeverity} from '../../entities/BeaconLogSeverity';
import {BeaconLog} from '../../entities/beacon-log.entity';
import {TranslateService} from '@ngx-translate/core';
import {BeaconStatus} from '../../entities/beacon-status.entity';
import {LayoutConfig} from '../../config/layout.config';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ut-beacon-list',
  templateUrl: './beacon-list.component.html',
  styleUrls: ['./beacon-list.component.less']
})
export class BeaconListComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static SUBSCRIPTION_TAG = 'beacon-list';

  private static EFFECTIVE_BATTERY_CAPACITY: number = 30;
  public static BEACON_LOGS_PAGE_SIZE: number = 25;
  public static BEACON_LIST_INITIAL_SIZE: number = 10;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public BeaconStatus = BeaconStatus;

  /**
   * Limit the amount of beacons shown by default if the viewport is < LG.
   * -1 means this value should be disregarded.
   */
  public limit: number = BeaconListComponent.BEACON_LIST_INITIAL_SIZE;

  private beaconsInternal: Array<BeaconFrontend>;
  private selectedBeaconIndex: number = 0;

  @Input()
  set beacons(beacons: Array<BeaconFrontend>) {
    if (this.limit !== -1 && this.limit > BeaconListComponent.BEACON_LIST_INITIAL_SIZE && beacons && beacons.length <= BeaconListComponent.BEACON_LIST_INITIAL_SIZE) {
      this.limit = BeaconListComponent.BEACON_LIST_INITIAL_SIZE;
    }
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
  public showStatus: boolean = false;

  @Input()
  public openStatus: boolean = false;

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
  public maxDatapoints: number = 5000;

  // color scheme for charts
  public colorScheme: any;

  constructor(private treeService: TreeService,
              private adminService: AdminService,
              private translateService: TranslateService,
              private subs: SubscriptionManagerService,
              private bpObserver: BreakpointObserver,
              private sanitizer: DomSanitizer,
              private cdRef: ChangeDetectorRef,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {

    this.preSelectDevice(this.preselectDeviceId);
    this.loadBeaconData();

    this.subs.register(this.bpObserver.observe(LayoutConfig.LAYOUT_MEDIA_STEPS)
             .subscribe((state: BreakpointState) => {
      if (state.breakpoints[LayoutConfig.LAYOUT_MEDIA_XS] ||
          state.breakpoints[LayoutConfig.LAYOUT_MEDIA_SM] ||
          state.breakpoints[LayoutConfig.LAYOUT_MEDIA_MD]) {
        this.limit = -1;
      } else if (this.limit === -1) {
        this.limit = BeaconListComponent.BEACON_LIST_INITIAL_SIZE;
      }
    }), BeaconListComponent.SUBSCRIPTION_TAG);

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(BeaconListComponent.SUBSCRIPTION_TAG);
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
    this.setStatus(StatusKey.BEACON_DATA_DOWNLOAD, StatusValue.PENDING);
    if (this.showData) {
      this.loadBeaconDataInternal(beacon);
    }
    if ((this.showStatus && !beacon.settings) || forceRefresh) {
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
    this.cdRef.detectChanges();
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
          domain: ['#A10A28', '#3e4da4', '#c79855']
        };
        break;
      case BeaconDataMode.TEMP_LAST_MONTH_PER_DAY:
        this.colorScheme = {
          domain: ['#A10A28', '#82a191', '#3e4da4']
        };
        break;
      case BeaconDataMode.HUMI_LAST_MONTH_PER_DAY:
        this.colorScheme = {
          domain: ['#3e4da4', '#82a191', '#c79855']
        };
        break;
    }

  }

  public downloadBeaconData(): void {

    this.setStatus(StatusKey.BEACON_DATA_DOWNLOAD, StatusValue.IN_PROGRESS);
    this.treeService.loadBeaconData(
      this.selectedBeacon.id,
      null,
      null,
      datasets => {
        const csvPayload = 'date,temperature,humidity,dew point\n' + datasets.map(d => {
          return d.observationDate.toISOString() + ',' + d.temperature + ',' + d.humidity + ',' + d.dewPoint;
        }).join('\n');
        const csvBlob = new Blob([csvPayload], { type: 'text/csv' });
        const csvUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(csvBlob));
        this.setStatus(StatusKey.BEACON_DATA_DOWNLOAD, StatusValue.SUCCESSFUL, csvUrl);
      }, (error, apiError) => {
        this.setStatus(StatusKey.BEACON_DATA_DOWNLOAD, StatusValue.FAILED);
      });

  }

  public getLimit(): number {
    return this.limit === -1 ? this.beaconsInternal.length : this.limit;
  }

}

export enum StatusKey {

  BEACON_DATA,
  BEACON_DATA_DOWNLOAD

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  PENDING = 3

}
