import {PhenologyObservationType} from './phenology-observation-type.entity';
import {PhenologyObservationResult} from './phenology-observation-result.entity';
import {PhenologyObservationObject} from './phenology-observation-object.entity';

/**
 * Class with state members for frontend.
 *
 * @author Laurenz Fiala
 * @since 2018/02/18
 */
export class PhenologyObservationTypeFrontend extends PhenologyObservationType {

  /**
   * Whether this observation is done or not?
   */
  public done: boolean = false;

  /**
   * TODO
   * @type {Map<PhenologyObservationObject, PhenologyObservationResult>}
   */
  public resultMap: any = {};

  constructor(id: number, name: string, objects: Array<PhenologyObservationObject>, results: Array<PhenologyObservationResult>) {
    super();
    this.id = id;
    this.name = name;
    this.objects = objects;
    this.results = results;
  }

  static fromObject(o: any): PhenologyObservationTypeFrontend {

    return new PhenologyObservationTypeFrontend(
      o.id,
      o.name,
      o.objects,
      o.results
    );

  }

}
