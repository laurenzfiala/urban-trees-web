import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Beacon} from '../../entities/beacon.entity';
import {BeaconService} from '../../services/beacon.service';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {AuthService} from '../../../shared/services/auth.service';
import {TranslateInitService} from '../../../shared/services/translate-init.service';

@Component({
  selector: 'ut-beacontransfer',
  templateUrl: './beacontransfer.component.html',
  styleUrls: ['./beacontransfer.component.less']
})
export class BeacontransferComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_BEACON_ID = 'beaconId';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public View = View;
  public TransferStatus = TransferStatus;

  public states: Array<TransferState>;
  public viewMode: View;
  public showTree: boolean = false;

  /**
   * Beacon to display status of
   * (loaded by its ID given in path params).
   */
  public beacon: Beacon;

  /**
   * Used to give the user feedback regarding beacon data transfer
   * and part of the stats given by the app (see constructor).
   */
  public appTransferAmount: number;

  constructor(public envService: EnvironmentService,
              private route: ActivatedRoute,
              private authService: AuthService,
              private beaconService: BeaconService,
              private translateInitService: TranslateInitService,
              private cdRef: ChangeDetectorRef,
              private zone: NgZone) {
    super();

    // make status updates accessible to the app
    window['updateTransferStatus'] = (statusKey: string) => {
      this.zone.run(args => {
        this.updateTransferStatus(statusKey);
        this.cdRef.detectChanges();
      });
    };
    window['transferStats'] = (dataAmount: number) => {
      this.zone.run(args => {
        this.appTransferAmount = dataAmount;
        this.cdRef.detectChanges();
      });
    };

  }

  public ngOnInit(): void {

    this.viewMode = View.NONE;
    this.states = new Array<TransferState>();
    this.translateInitService.onInit();
    this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.PENDING);

    this.route.params.subscribe((params: any) => {

      const beaconIdVal = Number(params[BeacontransferComponent.PATH_PARAMS_BEACON_ID]);

      if (!isNaN(beaconIdVal) && beaconIdVal) {
        this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.SUCCESSFUL);
        this.loadBeacon(beaconIdVal);
      } else {
        this.setStatus(StatusKey.BEACON_VALIDATION, StatusValue.FAILED);
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

  /**
   * Called by the app to signal a new transfer state.
   * @param statusKey state key; one of TransferStatus
   */
  public updateTransferStatus(statusKey: string): void {
    const status = TransferStatus[statusKey];
    const state = new TransferState(status);
    this.states.push(state);

    if (status === TransferStatus.COMM_DEVICE_READOUT_FINISHED && this.beacon) {
      this.loadBeacon(this.beacon.id);
    }
  }

  /**
   * Signal to the app that we want to cancel the readout now.
   */
  public cancelTransfer(): void {
    if (window['transferInterface']) {
      window['transferInterface'].cancelTransfer();
    }
  }

  public isLoggedInAndNotAnon(): boolean {
    return this.authService.isLoggedIn() && !this.authService.isUserAnonymous();
  }

  get currentState(): TransferState {
    return this.states[this.states.length - 1];
  }

}

export enum StatusKey {

  BEACON_VALIDATION,
  BEACON_LOADING

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

export class TransferState {

  public status: TransferStatus;
  public text: string;

  constructor(status: TransferStatus, text?: string) {
    this.status = status;
    this.text = text;
    if (text === undefined) {
      this.text = 'beacontransfer_view.status.' + TransferStatus[status];
    }
  }

  /**
   * Whether #status of this state signals
   * a transfer-in-progress state or not.
   */
  public isInProgress(): boolean {
    const transferringStates = [
      TransferStatus.COMM_DEVICE_GET_SETTINGS,
      TransferStatus.COMM_DEVICE_CONNECTING,
      TransferStatus.COMM_DEVICE_CONNECTED,
      TransferStatus.COMM_DEVICE_GET_DATA,
      TransferStatus.COMM_DEVICE_SEND_DATA,
      TransferStatus.COMM_DEVICE_CANCELLING
    ];
    return transferringStates.indexOf(this.status) !== -1;
  }

  /**
   * Whether #status of this state signals
   * the transfer is cancelling or not.
   */
  public isCancelling(): boolean {
    return this.status === TransferStatus.COMM_DEVICE_CANCELLING;
  }

  /**
   * Whether #status of this state signals
   * a transfer has ended (cancelled, failed or finished).
   */
  public isDone(): boolean {
    const transferringStates = [
      TransferStatus.COMM_DEVICE_GET_DATA_FAILED,
      TransferStatus.COMM_DEVICE_SEND_DATA_FAILED,
      TransferStatus.COMM_DEVICE_READOUT_FINISHED,
      TransferStatus.COMM_DEVICE_CANCELLED
    ];
    return transferringStates.indexOf(this.status) !== -1;
  }

  /**
   * Whether #status of this state signals
   * a successfully completed transfer state or not.
   */
  public isSuccess(): boolean {
    return this.status === TransferStatus.COMM_DEVICE_READOUT_FINISHED;
  }

}

export enum TransferStatus {

  COMM_DEVICE_GET_SETTINGS,
  COMM_DEVICE_CONNECTING,
  COMM_DEVICE_CONNECTED,
  COMM_DEVICE_GET_DATA,
  COMM_DEVICE_GET_DATA_FAILED,
  COMM_DEVICE_SEND_DATA,
  COMM_DEVICE_SEND_DATA_FAILED,
  COMM_DEVICE_READOUT_FINISHED,
  COMM_DEVICE_CANCELLING,
  COMM_DEVICE_CANCELLED

}

export enum View {

  NONE,
  BEACON,
  TREE

}
