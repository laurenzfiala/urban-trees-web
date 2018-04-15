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
   * Map of selected results for each object.
   * @type {Map<PhenologyObservationObject, PhenologyObservationResult>}
   */
  public resultMap: any = {};

  /**
   * Used only for the UI.
   * Whether the types' container is currently collapsed or not.
   */
  public containerCollapsed: boolean = true;

  /**
   * Used only for the UI.
   * We only want to auto-callapse a phenobs type once.
   */
  public wasAutoCollapsed: boolean = false;

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
