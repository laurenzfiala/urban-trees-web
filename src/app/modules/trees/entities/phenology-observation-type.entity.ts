/**
 * Describes the observation type (e.g. Buds, Leaves).
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
import {PhenologyObservationObject} from './phenology-observation-object.entity';
import {PhenologyObservationResult} from './phenology-observation-result.entity';

export class PhenologyObservationType {

  public id: number;
  public name: string;
  public optional: boolean;
  public objects: Array<PhenologyObservationObject>;
  public results: Array<PhenologyObservationResult>;

}
