import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TreeService} from '../../services/tree.service';
import {Tree} from '../../entities/tree.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {Mode} from '../../../shared/components/zoom/zoom.component';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {CmsContent} from '../../../cms/entities/cms-content.entity';
import {ViewMode} from '../../../cms/enums/cms-layout-view-mode.enum';
import {ContentService} from '../../../cms/services/content.service';
import {UserContent} from '../../../cms/entities/user-content.entity';

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
  public ViewMode = ViewMode;

  public treeContentPath: string;
  public treeContentLang: string;
  public treeContent: CmsContent;
  public treeContentViewMode: ViewMode = ViewMode.CONTENT;

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
              private contentService: ContentService,
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
      this.loadTreeContent();
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.TREE_LOADING, StatusValue.FAILED);
    });

  }

  private loadTreeContent(): void {
    this.treeContentPath = '/tree/' + this.tree.id;
    this.treeContentLang = 'de-DE';
    this.contentService.loadContent(this.treeContentPath, this.treeContentLang, content => {
      this.treeContent = CmsContent.fromUserContent(content[0], this.envService);
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
