import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';

import {Tree} from '../../../../entities/tree.entity';
import {AbstractComponent} from '../../../abstract.component';
import {Log} from '../../../../services/log.service';
import {TreeFrontend} from '../../../../entities/tree-frontend.entity';
import {EnvironmentService} from '../../../../services/environment.service';
import {PhenologyDatasetFrontend} from '../../../../entities/phenology-dataset-frontend.entity';
import {TranslateService} from '@ngx-translate/core';
import {MapComponent} from '../../../map/map.component';
import {BeaconFrontend} from '../../../../entities/beacon-frontend.entity';

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
   * Trees currently displayed.
   */
  public displayTrees: Array<Array<TreeFrontend>>;

  /**
   * Whether or not to display the tree list pagination.
   */
  public displayTreePagination: boolean;

  /**
   * Page index to display.
   */
  public currentDisplayTreePage: number = 0;

  /**
   * Tree currently selected.
   */
  public selectedTree: TreeFrontend;

  /**
   * Current tree search input.
   */
  public treeSearchInput: string;

  /**
   * Whether the map can currently be used, or its disabled.
   */
  public isMapEnabled: boolean = false;

  constructor(private observationsService: PhenologyObservationService,
              private environmentService: EnvironmentService,
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
        this.selectTree(alreadySelected.id);
      }

    });

  }

  /**
   * Load all trees using PhenologyObservationService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadTrees(successCallback: () => void) {

    if (this.availableTrees) {
      this.setDisplayTreesPaginated(this.availableTrees);
      successCallback();
      return;
    }

    this.setStatus(StatusKey.TREES, StatusValue.IN_PROGRESS);
    this.observationsService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      this.setDisplayTreesPaginated(this.availableTrees);
      successCallback();
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
    });

  }

  /**
   * Select a single tree to continue observation.
   * Resets all not-selected trees to selected = false.
   * @param {number} treeId id of that tree
   */
  public selectTree(treeId: number) {

    if (this.selectedTree) {
      this.selectedTree.selected = false;
    }
    this.selectedTree = this.availableTrees.find(value => value.id === treeId);
    this.selectedTree.selected = true;

    if (this.observationsService.selectedTree && this.selectedTree.speciesId !== this.observationsService.selectedTree.speciesId) {
      this.observationsService.setDone(0, true, true);
    } else {
      this.observationsService.setDone(0, true);
    }

  }

  /**
   * Set tree search and filter displayed trees by input.
   * @param {string} searchInput user's tree search input
   */
  public setTreeSearchInput(searchInput: string): void {

    if (!searchInput) {
      this.setDisplayTreesPaginated(this.availableTrees);
      return;
    }

    const idInput = Number(searchInput);
    if (!Number.isNaN(idInput)) {
      this.setDisplayTreesPaginated(this.availableTrees.filter((tree: TreeFrontend) => {
        return tree.id === idInput;
      }));
      return;
    }

    this.setDisplayTreesPaginated(
      this.availableTrees.filter((tree: TreeFrontend) => {
        const translationKey = ('tree.species.' + tree.species).toLowerCase();
        return this.translateService.instant(translationKey).toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.street.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.city.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
      })
    );

  }

  /**
   * Set the #displayTrees array using the correct pagination.
   * @param {Array<TreeFrontend>} trees the filtered trees to display.
   */
  private setDisplayTreesPaginated(trees: Array<TreeFrontend>) {

    const minPageSize = 10;
    const pages = 5;
    let pageSize = Math.ceil(this.availableTrees.length / pages);

    if (pageSize < minPageSize) {
      pageSize = minPageSize;
    }

    if (trees.length <= pageSize) {
      this.displayTreePagination = false;
    } else {
      this.displayTreePagination = true;
    }

    let paginatedArray = new Array<Array<TreeFrontend>>();

    let page = 0;
    for (let i = 0; i < trees.length; i += pageSize) {
      pageSize = i >= trees.length ? i - trees.length : pageSize;
      paginatedArray[page] = trees.slice(i, i + pageSize);
      page++;
    }

    this.currentDisplayTreePage = 0;
    this.displayTrees = paginatedArray;

  }

  /**
   * Change the currently displayed tree list page.
   * @param {number} displayIndex index to display.
   */
  public displayTreePage(displayIndex: number): void {

    if (displayIndex < 0 || displayIndex >= this.displayTrees.length) {
      return;
    }
    this.currentDisplayTreePage = displayIndex;

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
