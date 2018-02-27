/**
 * Contains all properties of a phenology observation to send to the backend.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
import {PhenologyObservation} from './phenology-observation.entity';
import {Announcement} from './announcement.entity';

export class PhenologyDataset {

  public treeId: number;
  public observationDate: string;
  public observers: string;
  public remark: string;

  public observations: Array<PhenologyObservation>;

  constructor();
  constructor(treeId?: number, observationDate?: string, observers?: string, remark?: string) {
    this.treeId = treeId;
    this.observationDate = observationDate;
    this.observers = observers;
    this.remark = remark;
  }

  public static fromObject(o: any): Announcement {

    return new Announcement(
      o.treeId,
      o.observationDate,
      o.observers,
      o.remark
    );

  }

}
