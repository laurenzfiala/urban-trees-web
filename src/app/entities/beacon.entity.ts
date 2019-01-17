/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
import {BeaconStatus} from './beacon-status.entity';
import {BeaconSettings} from './beacon-settings.entity';

export class Beacon {

  public id: number;
  public deviceId: string;
  public treeId: number;
  public bluetoothAddress: string;
  public status: BeaconStatus;

  /**
   * Additional settings of beacon
   */
  public settings: BeaconSettings;

  constructor(
    id?: number,
    deviceId?: string,
    treeId?: number,
    bluetoothAddress?: string,
    status?: BeaconStatus,
    settings?: BeaconSettings
  ) {
    this.id = id;
    this.deviceId = deviceId;
    this.treeId = treeId;
    this.bluetoothAddress = bluetoothAddress;
    this.status = status;
    this.settings = settings;
  }

  public static fromObject(o: any): Beacon {

    let b = new Beacon(
      o.id,
      o.deviceId,
      o.treeId,
      o.bluetoothAddress,
      o.status
    );

    if (o.settings) {
      b.settings = o.settings;
    }

    return b;

  }

}
