import {BeaconFrontend} from './beacon-frontend.entity';
import {TreeSpecies} from './tree-species.entity';
import {Location} from './location.entity';

/**
 * Core tree proerties.
 *
 * @author Laurenz Fiala
 * @since 2018/08/20
 */
export class TreeLight {

  public id: number;

  public location: Location;
  public species: TreeSpecies;
  public plantationYear: number;
  public isPlantationYearEstimate: boolean;

  constructor(
    id?: number,
    location?: Location,
    species?: TreeSpecies,
    plantationYear?: number,
    isPlantationYearEstimate?: boolean
  ) {
    this.id = id;
    this.location = location;
    this.species = species;
    this.plantationYear = plantationYear;
    this.isPlantationYearEstimate = isPlantationYearEstimate;
  }

  public static fromObject(o: any): TreeLight {

    return new TreeLight(
      o.id,
      o.location && Location.fromObject(o.location),
      o.species && TreeSpecies.fromObject(o.species),
      o.plantationYear,
      o.isPlantationYearEstimate
    );

  }

}
