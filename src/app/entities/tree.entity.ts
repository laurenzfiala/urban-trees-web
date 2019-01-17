import {TreeLocation} from './tree-location.entity';
import {BeaconFrontend} from './beacon-frontend.entity';
import {TreeSpecies} from './tree-species.entity';

/**
 * Single tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Tree {

  public id: number;

  public location: TreeLocation;
  public species: TreeSpecies;
  public plantationYear: number;
  public isPlantationYearEstimate: boolean;
  public beacons: Array<BeaconFrontend>;

  constructor(
    id: number,
    location: TreeLocation,
    species: TreeSpecies,
    plantationYear: number,
    isPlantationYearEstimate: boolean,
    beacons: Array<BeaconFrontend>
  ) {
    this.id = id;
    this.location = location;
    this.species = species;
    this.plantationYear = plantationYear;
    this.isPlantationYearEstimate = isPlantationYearEstimate;
    this.beacons = beacons;
  }

  public static fromObject(o: any): Tree {

    return new Tree(
      o.id,
      TreeLocation.fromObject(o.location),
      TreeSpecies.fromObject(o.species),
      o.plantationYear,
      o.isPlantationYearEstimate,
      o.beacons && o.beacons.map(b => BeaconFrontend.fromObject(b))
    );

  }

}
