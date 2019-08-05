import {Component, OnDestroy, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';

import {Tree} from '../../../../entities/tree.entity';
import {AbstractComponent} from '../../../abstract.component';
import {Log} from '../../../../services/log.service';
import {TreeFrontend} from '../../../../entities/tree-frontend.entity';
import {EnvironmentService} from '../../../../services/environment.service';
import {PhenologyDatasetFrontend} from '../../../../entities/phenology-dataset-frontend.entity';
import {TranslateService} from '@ngx-translate/core';
import {TreeService} from '../../../../services/tree.service';
import {MapMarker} from '../../../../interfaces/map-marker.entity';

/**
 * First step of a phenology observation.
 *
 * @author Laurenz Fiala
 * @since 2018/02/22
 */
@Component({
  selector: 'ut-a-info',
  templateUrl: './a-info.component.html',
  styleUrls: ['./a-info.component.less']
})
export class AInfoComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(AInfoComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Once loaded, contains all trees available for observation.
   */
  public availableTrees: Array<TreeFrontend>;

  /**
   * Tree currently selected.
   */
  public selectedTree: TreeFrontend;

  /**
   * Whether the map can currently be used, or its disabled.
   */
  public isMapEnabled: boolean = false;

  constructor(private observationsService: PhenologyObservationService,
              private treeService: TreeService,
              public translateService: TranslateService) {
    super();
  }

  public ngOnInit(): void {
    this.scrollToTop();
    this.observationsService.resetIfMarked();
    this.load();
  }

  public ngOnDestroy(): void {
    this.saveTreeSelection();
  }

  /**
   * Load available trees and initialize the map.
   */
  private load() {

    this.loadTrees(() => {

      let alreadySelected = this.observationsService.selectedTree;
      if (alreadySelected) {
        this.selectTree(TreeFrontend.fromTree(alreadySelected));
      }

    });

  }

  /**
   * Load all trees using PhenologyObservationService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadTrees(successCallback: () => void) {

    if (this.availableTrees) {
      successCallback();
      return;
    }

    this.setStatus(StatusKey.TREES, StatusValue.IN_PROGRESS);
    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      successCallback();
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
    });

  }

  /**
   * Select a single tree to continue observation.
   * @param {MapMarker} newSelectedTree tree that was newly selected
   */
  public selectTree(newSelectedTree: MapMarker) {

    this.selectedTree = <TreeFrontend> newSelectedTree;

    if (this.observationsService.selectedTree && this.selectedTree.species.id !== this.observationsService.selectedTree.species.id) {
      this.observationsService.setDone(0, true, true);
    } else {
      this.observationsService.setDone(0, true);
    }

  }

  /**
   * Save the currently selected tree to the service, so the next
   * step can access its informations.
   */
  private saveTreeSelection() {

    if (!this.availableTrees) {
      return;
    }

    this.observationsService.selectTree(this.selectedTree);

  }

  get dataset(): PhenologyDatasetFrontend {
    return this.observationsService.dataset;
  }

}

export enum StatusKey {

  TREES

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
