import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {MeasurementStatistics} from '../../entities/measurement-statistics.entity';
import {UIService} from '../../services/ui.service';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {BeaconStatus} from '../../entities/beacon-status.entity';
import {BeaconService} from '../../services/beacon.service';
import {EnvironmentService} from '../../services/environment.service';
import {SearchService} from '../../services/search.service';

@Component({
  selector: 'ut-measurements',
  templateUrl: './measurements.component.html',
  styleUrls: ['./measurements.component.less']
})
export class MeasurementsComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Statistics regarding the trees overall.
   */
  public statistics: MeasurementStatistics;

  public availableBeacons: Array<BeaconFrontend> = new Array<BeaconFrontend>();
  public displayBeacons: Array<BeaconFrontend> = new Array<BeaconFrontend>();

  public beaconSearchInput: string;

  constructor(private uiService: UIService,
              private beaconService: BeaconService,
              private envService: EnvironmentService,
              private searchService: SearchService) {
    super();
  }

  public ngOnInit() {
    this.loadStatistics();
    this.loadBeacons(() => {
      this.onBeaconSearchInputChange();
    });
  }

  /**
   * Load measurement stats using UIService.
   * @param {() => void} successCallback when loading was successful.
   */
  public loadStatistics(successCallback?: () => void): void {

    this.setStatus(StatusKey.STATISTICS, StatusValue.IN_PROGRESS);
    if (successCallback && this.statistics) {
      successCallback();
      return;
    }

    this.uiService.loadMeasurementStatistics((stats: MeasurementStatistics) => {
      this.statistics = stats;
      this.setStatus(StatusKey.STATISTICS, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.STATISTICS, StatusValue.FAILED, apiError);
    });

  }

  /**
   * Load beacons using BeaconService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadBeacons(successCallback?: () => void): void {

    this.setStatus(StatusKey.BEACONS, StatusValue.IN_PROGRESS);

    this.beaconService.loadBeacons((beacons: Array<BeaconFrontend>) => {
      this.availableBeacons = beacons;
      this.setStatus(StatusKey.BEACONS, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.BEACONS, StatusValue.FAILED, apiError);
    });

  }

  public onBeaconSearchInputChange(value?: string): void {

    if (value === undefined) {
      value = this.beaconSearchInput;
    }
    this.beaconSearchInput = value;

    if (!value) {
      this.displayBeacons = this.availableBeacons;
      return;
    }

    // debounce search input (for improved performance)
    setTimeout(() => {
      if (this.beaconSearchInput !== value) {
        return;
      }
      this.searchService.search(this.availableBeacons, value, 'msmts-beacon-list', undefined, 3).then(results => {
        this.displayBeacons = results;
      });
    }, this.envService.searchDebounceMs);

  }

}

export enum StatusKey {

  STATISTICS,
  BEACONS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
