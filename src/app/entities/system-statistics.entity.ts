/**
 * Statistics about the system.
 *
 * @author Laurenz Fiala
 * @since 2018/07/14
 */
import {DateIntValue} from './date-int-value.entity';
import {Role} from './role.entity';

export class SystemStatistics {

  public cityAmount: number;
  public treeAmount: number;
  public treeSpeciesAmount: number;
  public phenologyObservationAmount: number;
  public phenologyObservationObjectAmount: number;
  public beaconAmount: number;
  public beaconDatasetAmount: number;

  public beaconReadouts: Array<DateIntValue>;
  public phenologyObservations: Array<DateIntValue>;

  constructor(
    cityAmount: number,
    treeAmount: number,
    treeSpeciesAmount: number,
    phenologyObservationAmount: number,
    phenologyObservationObjectAmount: number,
    beaconAmount: number,
    beaconDatasetAmount: number,
    beaconReadouts: Array<DateIntValue>,
    phenologyObservations: Array<DateIntValue>
  ) {
    this.cityAmount = cityAmount;
    this.treeAmount = treeAmount;
    this.treeSpeciesAmount = treeSpeciesAmount;
    this.phenologyObservationAmount = phenologyObservationAmount;
    this.phenologyObservationObjectAmount = phenologyObservationObjectAmount;
    this.beaconAmount = beaconAmount;
    this.beaconDatasetAmount = beaconDatasetAmount;
    this.beaconReadouts = beaconReadouts;
    this.phenologyObservations = phenologyObservations;
  }

  public static fromObject(o: any): SystemStatistics {

    return new SystemStatistics(
      o.cityAmount,
      o.treeAmount,
      o.treeSpeciesAmount,
      o.phenologyObservationAmount,
      o.phenologyObservationObjectAmount,
      o.beaconAmount,
      o.beaconDatasetAmount,
      o.beaconReadouts && o.beaconReadouts.map(r => DateIntValue.fromObject(r)),
      o.phenologyObservations && o.phenologyObservations.map(r => DateIntValue.fromObject(r))
    );

  }

}
