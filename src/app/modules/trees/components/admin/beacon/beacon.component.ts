import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../../shared/components/abstract.component';
import {TreeService} from '../../../services/tree.service';
import {BeaconFrontend} from '../../../entities/beacon-frontend.entity';
import {BeaconService} from '../../../services/beacon.service';

@Component({
  selector: 'ut-admin-beacon',
  templateUrl: './beacon.component.html',
  styleUrls: ['../tree/tree.component.less', './beacon.component.less']
})
export class AdminBeaconComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public availableBeacons: Array<BeaconFrontend>;

  /**
   * Beacons that's being edited.
   */
  public beacon: BeaconFrontend;

  constructor(private treeService: TreeService,
              private beaconService: BeaconService) {
    super();
  }

  public ngOnInit(): void {

    this.load();

  }

  /**
   * Load all needed data.
   */
  public load(): void {
    this.loadBeacons();
  }

  private loadBeacons(selectBeaconByDeviceId?: string): void {

    this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.IN_PROGRESS);
    this.beaconService.loadBeacons((beacons: Array<BeaconFrontend>) => {
      this.availableBeacons = beacons;
      this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  LOAD_BEACONS,
  SAVE_BEACON

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
