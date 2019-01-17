import {PhenologyObservation} from './phenology-observation.entity';
import {TreeLocation} from './tree-location.entity';
import {Tree} from './tree.entity';
import {MapMarker} from '../interfaces/map-marker.entity';
import {BeaconFrontend} from './beacon-frontend.entity';

/**
 * Single tree with frontend state variables.
 *
 * @author Laurenz Fiala
 * @since 2018/02/18
 */
export class TreeFrontend extends Tree implements MapMarker {

  constructor(tree: Tree) {
    super(
      tree.id,
      tree.location,
      tree.species,
      tree.plantationYear,
      tree.isPlantationYearEstimate,
      tree.beacons
    );
  }

  // MapMarker interface methods
  public getCoordsX(): number {
    return this.location.coordinates.x;
  }

  public getCoordsY(): number {
    return this.location.coordinates.y;
  }

  public getId(): number {
    return this.id;
  }

  /**
   * Transform tree into treefrontend.
   */
  public static fromTree(tree: Tree): TreeFrontend {
    return new TreeFrontend(tree);
  }

}
