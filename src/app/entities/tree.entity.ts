import {PhenologyObservation} from './phenology-observation.entity';
import {TreeLocation} from './tree-location.entity';

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

}
