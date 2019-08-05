import { Component, OnInit } from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute} from '@angular/router';
import {TreeService} from '../../services/tree.service';
import {Tree} from '../../entities/tree.entity';
import {EnvironmentService} from '../../services/environment.service';

@Component({
  selector: 'ut-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_TREE_ID = 'treeId';

  private static QUERY_PARAMS_APP_TRANSFER_STATUS = 'readout';
  private static QUERY_PARAMS_APP_TRANSFER_AMOUNT = 'readoutAmount';
  private static QUERY_PARAMS_BEACON_PRESELECT = 'beacon';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public tree: Tree;

  /**
   * This is populated via the query params by the app and used
   * to give the user feedback regarding beacon data transfer.
   * @see QUERY_PARAMS_APP_TRANSFER_AMOUNT
   */
  public appTransferAmount: number;

  /**
   * This is populated via the query params by the app and used
   * to preselect a beacon by deviceId.
   * @see QUERY_PARAMS_BEACON_PRESELECT
   */
  public beaconDeviceIdPreselect: string;

  /**
   * Whether the tree slideshow should be paused or played.
   */
  public pauseTreeSlideshow: boolean = false;

  constructor(private route: ActivatedRoute,
              private treeService: TreeService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.PENDING);

    this.route.params.subscribe((params: any) => {

      const treeIdVal = Number(params[TreeComponent.PATH_PARAMS_TREE_ID]);

      if (!isNaN(treeIdVal) && treeIdVal) {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.SUCCESSFUL);
        this.loadTree(treeIdVal);
      } else {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.FAILED);
      }

    });

    this.route.queryParams.subscribe((params: any) => {

      const appTransferStatusVal: AppTransferStatusParam = params[TreeComponent.QUERY_PARAMS_APP_TRANSFER_STATUS];

      if (appTransferStatusVal === AppTransferStatusParam.SUCCESSFUL) {
        this.setStatus(StatusKey.APP_TRANSFER_STATUS, StatusValue.SUCCESSFUL);
      } else if (appTransferStatusVal === AppTransferStatusParam.FAILED) {
        this.setStatus(StatusKey.APP_TRANSFER_STATUS, StatusValue.FAILED);
      }

      const appTransferAmountVal: number = params[TreeComponent.QUERY_PARAMS_APP_TRANSFER_AMOUNT];
      if (appTransferAmountVal) {
        this.appTransferAmount = appTransferAmountVal;
      }

      const beaconPreselectVal: AppTransferStatusParam = params[TreeComponent.QUERY_PARAMS_BEACON_PRESELECT];
      if (beaconPreselectVal) {
        this.beaconDeviceIdPreselect = beaconPreselectVal;
      }

    });

  }

  private loadTree(treeId: number): void {

    this.setStatus(StatusKey.TREE_LOADING, StatusValue.IN_PROGRESS);
    this.treeService.loadTree(treeId, (tree: Tree) => {
      this.tree = tree;
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  TREE_VALIDATION,
  TREE_LOADING,
  APP_TRANSFER_STATUS

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED = -1

}

export enum AppTransferStatusParam {

  SUCCESSFUL = 'successful',
  FAILED = 'failed'

}
