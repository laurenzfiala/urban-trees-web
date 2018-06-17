/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
import {BeaconStatus} from './beacon-status.entity';

export class Beacon {

  public id: number;
  public deviceId: string;
  public treeId: number;
  public bluetoothAddress: string;
  public status: BeaconStatus;

  constructor(
    id: number,
    deviceId: string,
    treeId: number,
    bluetoothAddress: string,
    status: BeaconStatus
  ) {
    this.id = id;
    this.deviceId = deviceId;
    this.treeId = treeId;
    this.bluetoothAddress = bluetoothAddress;
    this.status = status;
  }

  public static fromObject(o: any): Beacon {

    return new Beacon(
      o.id,
      o.deviceId,
      o.treeId,
      o.bluetoothAddress,
      o.status
    );

  }

}
