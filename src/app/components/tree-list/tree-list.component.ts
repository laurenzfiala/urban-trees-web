import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, QueryList} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {Tree} from '../../entities/tree.entity';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {TreeListStatistics} from '../../entities/tree-list-statistics.entity';
import {Log} from '../../services/log.service';
import {TreeService} from '../../services/tree.service';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../entities/city.entity';

@Component({
  selector: 'ut-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.less']
})
export class TreeListComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(TreeListComponent);

  /**
   * Statistics regarding the trees overall.
   */
  public statistics: TreeListStatistics;

  /**
   * Once loaded, contains all trees available.
   */
  public availableTrees: Array<TreeFrontend>;

  /**
   * Trees currently displayed.
   */
  public displayTrees: Array<TreeFrontend>;

  /**
   * All cities to display.
   */
  public cities: Array<City>;

  /**
   * Current tree search input.
   */
  public treeSearchInput: string;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(private treeService: TreeService,
              private translateService: TranslateService) {
    super();
  }

  public ngOnInit() {

    this.load();

  }

  /**
   * Load all resource neccessary for this page.
   */
  public load(): void {

    this.loadStatistics();
    this.loadTreeList();

  }

  /**
   * Load all cities & trees.
   */
  public loadTreeList(): void {
    this.loadTrees(() => {
      this.displayTrees = this.availableTrees;
    });
    this.loadCities();
  }

  /**
   * Load tree stats using TreeListService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadStatistics(successCallback?: () => void): void {

    this.setStatus(StatusKey.STATISTICS, StatusValue.IN_PROGRESS);
    if (this.availableTrees) {
      successCallback();
      return;
    }

    this.treeService.loadStatistics((stats: TreeListStatistics) => {
      this.statistics = stats;
      this.setStatus(StatusKey.STATISTICS, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, () => {
      this.setStatus(StatusKey.STATISTICS, StatusValue.FAILED); // TODO change content of error message
    });

  }

  /**
   * Load all trees using TreeListService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadTrees(successCallback?: () => void): void {

    this.setStatus(StatusKey.TREES, StatusValue.IN_PROGRESS);
    if (this.availableTrees) {
      successCallback();
      return;
    }

    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = <Array<TreeFrontend>>trees;
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
    });

  }

  /**
   * Load all cities using TreeListService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadCities(successCallback?: () => void): void {

    this.setStatus(StatusKey.CITIES, StatusValue.IN_PROGRESS);
    if (this.cities) {
      successCallback();
      return;
    }

    this.treeService.loadCities((cities: Array<City>) => {
      this.cities = <Array<City>>cities;
      this.setStatus(StatusKey.CITIES, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, () => {
      this.setStatus(StatusKey.CITIES, StatusValue.FAILED);
    });

  }

  /**
   * Set tree search and filter displayed trees by input.
   * @param {string} searchInput user's tree search input
   */
  public setTreeSearchInput(searchInput: string): void {

    if (!searchInput) {
      this.displayTrees = this.availableTrees;
      return;
    }

    const idInput = Number(searchInput);
    if (!Number.isNaN(idInput)) {
      this.displayTrees = this.availableTrees.filter((tree: TreeFrontend) => {
        return tree.id === idInput;
      });
      return;
    }

    this.displayTrees = this.availableTrees.filter((tree: TreeFrontend) => {
        const translationKey = ('tree.species.' + tree.species).toLowerCase();
        return this.translateService.instant(translationKey).toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.street.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.city.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
      });

  }

}

export enum StatusKey {

  STATISTICS,
  TREES,
  CITIES

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
