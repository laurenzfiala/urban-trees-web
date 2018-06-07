import {PhenologyObservation} from './phenology-observation.entity';
import {TreeLocation} from './tree-location.entity';

/**
 * All statistics to be displayed on the tree list page.
 *
 * @author Laurenz Fiala
 * @since 2018/05/23
 */
export class TreeListStatistics {

  public cityAmount: number;
  public treeAmount: number;
  public treeSpeciesAmount: number;
  public phenologyObservationAmount: number;
  public phenologyObservationObjectAmount: number;
  public beaconAmount: number;
  public beaconDatasetAmount: number;

  public beaconTempMinimum: number;
  public beaconTempAverage: number;
  public beaconTempMaximum: number;

  public beaconHumidityMinimum: number;
  public beaconHumidityAverage: number;
  public beaconHumidityMaximum: number;

}
