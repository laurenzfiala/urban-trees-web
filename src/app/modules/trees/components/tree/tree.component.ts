import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TreeService} from '../../services/tree.service';
import {Tree} from '../../entities/tree.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import { Mode } from '../../../shared/components/zoom/zoom.component';
import {AbstractComponent} from '../../../shared/components/abstract.component';

@Component({
  selector: 'ut-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class TreeComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_TREE_ID = 'treeId';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public Mode = Mode;

  /**
   * If the route param does not hold a tree ID, this may hold the fallback.
   */
  @Input()
  public treeId: number;

  /**
   * Tree to display.
   */
  public tree: Tree;

  constructor(private route: ActivatedRoute,
              private treeService: TreeService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.PENDING);

    this.route.params.subscribe((params: any) => {

      const treeIdParam = params[TreeComponent.PATH_PARAMS_TREE_ID];
      let treeIdVal = Number(treeIdParam);
      if (treeIdParam === undefined) {
        treeIdVal = this.treeId;
      }

      if (!isNaN(treeIdVal) && treeIdVal) {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.SUCCESSFUL);
        this.loadTree(treeIdVal);
      } else {
        this.setStatus(StatusKey.TREE_VALIDATION, StatusValue.FAILED);
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
