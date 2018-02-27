import {PhenologyObservation} from './phenology-observation.entity';
import {TreeLocation} from './tree-location.entity';
import {Tree} from './tree.entity';

/**
 * Single tree with frontend state variables.
 *
 * @author Laurenz Fiala
 * @since 2018/02/18
 */
export class TreeFrontend extends Tree {

  public selected: boolean;

}
