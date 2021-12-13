/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
import {BeaconStatus} from './beacon-status.entity';
import {BeaconSettings} from './beacon-settings.entity';
import {Location} from './location.entity';
import {TreeLight} from './tree-light.entity';
import {search} from '../decorators/search.decorator';

export class Beacon {

  @search()
  public id: number;

  @search()
  public deviceId: string;

  @search()
  public tree: TreeLight;

  @search(undefined, undefined, 'address')
  public bluetoothAddress: string;

  public status: BeaconStatus;

  @search()
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

  /**
   * Updates the given beacon using the value of the given beacon.
   * @param updatedBeacon beacon using which this beacon shall be updated
   */
  public update(updatedBeacon: Beacon) {
    this.id = updatedBeacon.id;
    this.deviceId = updatedBeacon.deviceId;
    this.tree = updatedBeacon.tree;
    this.bluetoothAddress = updatedBeacon.bluetoothAddress;
    this.status = updatedBeacon.status;
    this.location = updatedBeacon.location;
    this.settings = updatedBeacon.settings;
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
