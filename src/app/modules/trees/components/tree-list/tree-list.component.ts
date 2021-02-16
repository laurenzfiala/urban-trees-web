import {Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {Tree} from '../../entities/tree.entity';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {Log} from '../../../shared/services/log.service';
import {TreeService} from '../../services/tree.service';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../entities/city.entity';
import {MapMarker} from '../../interfaces/map-marker.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {query} from '@angular/animations';
import {SearchService} from '../../services/search.service';
import {delay} from 'rxjs-compat/operator/delay';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.less']
})
export class TreeListComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(TreeListComponent);

  private static QUERY_PARAMS_SEARCH_INPUT: string = 'query';

  /**
   * Once loaded, contains all trees available.
   */
  public availableTrees: Array<TreeFrontend>;

  /**
   * Trees currently displayed.
   */
  public displayTrees: Array<TreeFrontend>;

  /**
   * Tree currently selected.
   */
  public selectedTree: TreeFrontend;

  /**
   * All cities to display.
   */
  public cities: Array<City> = new Array<City>();

  /**
   * Current tree search input.
   */
  public treeSearchInput: string;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(private treeService: TreeService,
              private translateService: TranslateService,
              private searchService: SearchService,
              private envService: EnvironmentService,
              private route: ActivatedRoute,
              private router: Router) {
    super();
  }

  public ngOnInit() {

    const searchInputVal = this.route.snapshot.queryParamMap.get(TreeListComponent.QUERY_PARAMS_SEARCH_INPUT);
    this.setTreeSearchInput(searchInputVal);

    this.load();

  }

  /**
   * Load all resource neccessary for this page.
   */
  public load(): void {
    this.loadTreeList();
  }

  /**
   * Load all cities & trees.
   */
  public loadTreeList(): void {
    this.loadTrees(() => {
      this.displayTrees = this.availableTrees;
      this.updateCities();
      this.setTreeSearchInput(undefined, false);
    });
  }

  /**
   * Get all cities to display
   * from displayTrees array.
   */
  private updateCities(): void {
    this.cities = new Array<City>();
    let found;
    for (let t of this.displayTrees) {
      found = false;
      for (let c of this.cities) {
        if (City.equals(t.location.city, c)) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.cities.push(t.location.city);
      }
    }
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
      this.availableTrees = trees.map(t => TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
    });

  }

  /**
   * Set tree search and filter displayed trees by input.
   * @param {string} searchInput user's tree search input
   */
  public setTreeSearchInput(searchInput?: string, updateMember: boolean = true): void {

    if (updateMember) {
      this.treeSearchInput = searchInput;
    } else {
      searchInput = this.treeSearchInput;
    }
    if (!this.availableTrees) {
      return;
    }

    // change page query parameters
    let queryParams = {};
    if (searchInput) {
      queryParams = { 'query': searchInput };
    }

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParams: queryParams,
        replaceUrl: true,
        state: {'scrollTop': false}
    });
    // ----------------------------

    this.selectedTree = null;

    // debounce search input (for improved performance)
    setTimeout(() => {
      if (this.treeSearchInput !== searchInput) {
        return;
      }
      this.searchService.search(this.availableTrees, searchInput, 'tree-list', undefined, 2).then(results => {
        this.displayTrees = results;
        this.updateCities();
      });
    }, this.envService.searchDebounceMs);

  }

  /**
   * Called when a tree is selected in the map.
   * @param {MapMarker} newSelectedTree tree that was newly selected
   */
  public selectTreeOnMap(newSelectedTree: MapMarker) {
    this.treeSearchInput = 'id:' + (<TreeFrontend> newSelectedTree).getId();
    this.setTreeSearchInput(undefined, false);
    this.selectedTree = <TreeFrontend> newSelectedTree;
  }

}

export enum ComparatorResult {
  TRUE,
  FALSE,
  ABSTAIN
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
