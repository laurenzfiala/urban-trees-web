/**
 * A single phenology observation.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
import {PhenologyObservationObject} from './phenology-observation-object.entity';
import {PhenologyObservationResult} from './phenology-observation-result.entity';

export class PhenologyObservation {

  public id: number;

  public object: PhenologyObservationObject;
  public result: PhenologyObservationResult;

  constructor(object?: PhenologyObservationObject,
              result?: PhenologyObservationResult) {

    this.object = object;
    this.result = result;

  }

}
