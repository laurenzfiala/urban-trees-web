import {TreeSpecies} from './tree-species.entity';
import {Location} from './location.entity';
import {search} from '../decorators/search.decorator';

/**
 * Core tree proerties.
 *
 * @author Laurenz Fiala
 * @since 2018/08/20
 */
export class TreeLight {

  @search('tree-list')
  @search('msmts-beacon-list', undefined, 'treeid')
  public id: number;


  @search('tree-list', undefined, false)
  @search('msmts-beacon-list', undefined, 'treelocation')
  public location: Location;

  @search('tree-list', undefined, false)
  @search('msmts-beacon-list', undefined, 'treespecies')
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
