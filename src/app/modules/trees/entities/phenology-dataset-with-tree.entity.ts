/**
 * Contains all properties of a phenology observation to send to the backend.
 *
 * @author Laurenz Fiala
 * @since 2020/11/13
 */
import {PhenologyDataset} from './phenology-dataset.entity';
import {TreeLight} from './tree-light.entity';

export class PhenologyDatasetWithTree extends PhenologyDataset {

  public tree: TreeLight;

  constructor(id?: number,
              treeId?: number,
              observationDate?: string,
              observersUserIds?: Array<number>,
              observersRef?: number,
              observers?: string,
              remark?: string,
              tree?: TreeLight) {
    super(id, treeId, observationDate, observersUserIds, observersRef, observers, remark);
    this.tree = tree;
  }

  public static fromObject(o: any): PhenologyDataset {

    return new PhenologyDatasetWithTree(
      o.id,
      o.treeId,
      o.observationDate,
      o.observersUserIds,
      o.observersRef,
      o.observers,
      o.remark,
      o.tree ? TreeLight.fromObject(o.tree) : null
    );

  }

}
