import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AbstractComponent} from '../abstract.component';
import {Beacon} from '../../entities/beacon.entity';
import {BeaconService} from '../../services/beacon.service';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-beacontransfer',
  templateUrl: './beacontransfer.component.html',
  styleUrls: ['./beacontransfer.component.less']
})
export class BeacontransferComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_BEACON_ID = 'beaconId';
  private static PATH_PARAMS_APP_TRANSFER_STATUS = 'transferStatus';

  private static QUERY_PARAMS_APP_TRANSFER_AMOUNT = 'readoutAmount';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Beacon to display status of
   * (loaded by its ID given in path params).
   */
  public beacon: Beacon;

  /**
   * This is populated via the query params by the app and used
   * to give the user feedback regarding beacon data transfer.
   * @see QUERY_PARAMS_APP_TRANSFER_AMOUNT
   */
  public appTransferAmount: number;

  constructor(private route: ActivatedRoute,
              public envService: EnvironmentService,
              private beaconService: BeaconService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.PENDING);

    this.route.params.subscribe((params: any) => {

      const treeIdVal = Number(params[BeacontransferComponent.PATH_PARAMS_BEACON_ID]);

      if (!isNaN(treeIdVal) && treeIdVal) {
        this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.SUCCESSFUL);
        this.loadBeacon(treeIdVal);
      } else {
        this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.FAILED);
      }

      const appTransferStatusVal: AppTransferStatusParam = params[BeacontransferComponent.PATH_PARAMS_APP_TRANSFER_STATUS];

      if (appTransferStatusVal === AppTransferStatusParam.SUCCESSFUL) {
        this.setStatus(StatusKey.APP_TRANSFER_STATUS, StatusValue.SUCCESSFUL);
      } else if (appTransferStatusVal === AppTransferStatusParam.FAILED) {
        this.setStatus(StatusKey.APP_TRANSFER_STATUS, StatusValue.FAILED);
      }

    });

    this.route.queryParams.subscribe((params: any) => {

      const appTransferAmountVal: number = params[BeacontransferComponent.QUERY_PARAMS_APP_TRANSFER_AMOUNT];
      if (appTransferAmountVal) {
        this.appTransferAmount = appTransferAmountVal;
      }

    });

  }

  private loadBeacon(beaconId: number): void {

    this.setStatus(StatusKey.BEACON_LOADING, StatusValue.IN_PROGRESS);
    this.beaconService.loadBeacon(beaconId, (beacon: BeaconFrontend) => {
      this.beacon = beacon;
      this.setStatus(StatusKey.BEACON_LOADING, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.BEACON_LOADING, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  BEACON_VALIDATION,
  BEACON_LOADING,
  APP_TRANSFER_STATUS

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED = -1

}

export enum AppTransferStatusParam {

  SUCCESSFUL = 'successful',
  FAILED = 'failed'

}
