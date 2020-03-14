import {BeaconFrontend} from './beacon-frontend.entity';
import {TreeSpecies} from './tree-species.entity';
import {Location} from './location.entity';
import {TreeLight} from './tree-light.entity';

/**
 * Single tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Tree extends TreeLight {

  public beacons: Array<BeaconFrontend>;

  constructor(
    id: number,
    location: Location,
    species: TreeSpecies,
    plantationYear: number,
    isPlantationYearEstimate: boolean,
    beacons: Array<BeaconFrontend>
  ) {
    super(id, location, species, plantationYear, isPlantationYearEstimate);
    this.beacons = beacons;
  }

  public static fromObject(o: any): Tree {

    return new Tree(
      o.id,
      Location.fromObject(o.location),
      TreeSpecies.fromObject(o.species),
      o.plantationYear,
      o.isPlantationYearEstimate,
      o.beacons && o.beacons.map(b => BeaconFrontend.fromObject(b))
    );

  }

}
