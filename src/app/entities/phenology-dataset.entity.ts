/**
 * Contains all properties of a phenology observation to send to the backend.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
import {PhenologyObservation} from './phenology-observation.entity';
import {Announcement} from './announcement.entity';

export class PhenologyDataset {

  public id: number;

  public treeId: number;
  public observationDate: string;
  public observers: string;
  public remark: string;

  public observations: Array<PhenologyObservation>;

  constructor(id?: number, treeId?: number, observationDate?: string, observers?: string, remark?: string) {
    this.id = id;
    this.treeId = treeId;
    this.observationDate = observationDate;
    this.observers = observers;
    this.remark = remark;
  }

  public static fromObject(o: any): PhenologyDataset {

    return new PhenologyDataset(
      o.id,
      o.treeId,
      o.observationDate,
      o.observers,
      o.remark
    );

  }

}
