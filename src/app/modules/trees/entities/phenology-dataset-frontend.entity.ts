import {PhenologyDataset} from './phenology-dataset.entity';
import * as moment from 'moment';
import {TranslateService} from '@ngx-translate/core';
import {UserIdentity} from './user-identity.entity';

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

  public observersUserIdentities: Set<UserIdentity> = new Set<UserIdentity>();

  /**
   * Apply the frontend values to the backend object
   * and return the downcast backend object.
   * @param dateFormat string date format
   */
  public apply(dateFormat: string): PhenologyDataset {
    this.observationDate = moment(this.uiObservationDate).utc().format(dateFormat);
    this.observersUserIds = new Array<number>();
    for (let u of this.observersUserIdentities) {
      this.observersUserIds.push(u.id);
    }
    return <PhenologyDataset>this;
  }

}
