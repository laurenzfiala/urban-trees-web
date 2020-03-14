/**
 * Contains all properties of a phenology observation to send to the backend.
 *
 * @author Laurenz Fiala
 * @since 2018/02/04
 */
import {PhenologyObservation} from './phenology-observation.entity';

export class PhenologyDataset {

  public id: number;

  public treeId: number;
  public observationDate: string;
  public observersUserIds: Array<number>;
  public observers: string;
  public observersRef: number;
  public remark: string;

  public observations: Array<PhenologyObservation>;

  constructor(id?: number,
              treeId?: number,
              observationDate?: string,
              observersUserIds?: Array<number>,
              observersRef?: number,
              observers?: string,
              remark?: string) {
    this.id = id;
    this.treeId = treeId;
    this.observationDate = observationDate;
    this.observers = observers;
    this.observersUserIds = observersUserIds;
    this.observersRef = observersRef;
    this.remark = remark;
  }

  public static fromObject(o: any): PhenologyDataset {

    return new PhenologyDataset(
      o.id,
      o.treeId,
      o.observationDate,
      o.observersUserIds,
      o.observersRef,
      o.observers,
      o.remark
    );

  }

}
