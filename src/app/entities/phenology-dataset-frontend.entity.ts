import {PhenologyDataset} from './phenology-dataset.entity';
import {Moment} from 'moment';
import * as moment from 'moment';

/**
 * Used to collect the users' input and values for the backend,
 * as well as state variables used for the view.
 * All frontend member-names should be prepended by 'ui'.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
export class PhenologyDatasetFrontend extends PhenologyDataset {

  public uiObservationDate: Date;

  public uiMaxObservationDate: Date;

  /**
   * Apply the frontend values to the backend object
   * and return the downcast backend object.
   */
  public apply(): PhenologyDataset {
    // TODO configuration for time format
    this.observationDate = moment(this.uiObservationDate).utc().format('YYYY-MM-DD[T]HH-mm-ss');
    return <PhenologyDataset>this;
  }

}
