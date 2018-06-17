import {TreeLocation} from './tree-location.entity';
import {Beacon} from './beacon.entity';
import {BeaconFrontend} from './beacon-frontend.entity';

/**
 * Single tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Tree {

  public id: number;

  public location: TreeLocation;
  public speciesId: number;
  public species: string;
  public genusId: number;
  public genus: string;
  public plantationYear: number;
  public isPlantationYearEstimate: boolean;
  public beacons: Array<BeaconFrontend>;

  constructor(
    id: number,
    location: TreeLocation,
    speciesId: number,
    species: string,
    genusId: number,
    genus: string,
    plantationYear: number,
    isPlantationYearEstimate: boolean,
    beacons: Array<BeaconFrontend>
  ) {
    this.id = id;
    this.location = location;
    this.speciesId = speciesId;
    this.species = species;
    this.genusId = genusId;
    this.genus = genus;
    this.plantationYear = plantationYear;
    this.isPlantationYearEstimate = isPlantationYearEstimate;
    this.beacons = beacons;
  }

  public static fromObject(o: any): Tree {

    return new Tree(
      o.id,
      o.location,
      o.speciesId,
      o.species,
      o.genusId,
      o.genus,
      o.plantationYear,
      o.isPlantationYearEstimate,
      o.beacons && o.beacons.map(b => BeaconFrontend.fromObject(b))
    );

  }

}
