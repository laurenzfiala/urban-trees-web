/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
import {BeaconStatus} from './beacon-status.entity';
import {BeaconSettings} from './beacon-settings.entity';
import {Location} from './location.entity';
import {TreeLight} from './tree-light.entity';

export class Beacon {

  public id: number;
  public deviceId: string;
  public tree: TreeLight;
  public bluetoothAddress: string;
  public status: BeaconStatus;
  public location: Location;

  /**
   * Additional settings of beacon
   */
  public settings: BeaconSettings;

  constructor(
    id?: number,
    deviceId?: string,
    tree?: TreeLight,
    bluetoothAddress?: string,
    status?: BeaconStatus,
    location?: Location,
    settings?: BeaconSettings
  ) {
    this.id = id;
    this.deviceId = deviceId;
    this.tree = tree;
    this.bluetoothAddress = bluetoothAddress;
    this.status = status;
    this.location = location;
    this.settings = settings;
  }

  public static fromObject(o: any): Beacon {

    return new Beacon(
      o.id,
      o.deviceId,
      o.tree && TreeLight.fromObject(o.tree),
      o.bluetoothAddress,
      o.status,
      o.location && Location.fromObject(o.location),
      o.settings && BeaconSettings.fromObject(o.settings)
    );

  }

}
