import {ChangeDetectorRef, Component, ElementRef, HostListener, Inject, OnInit, QueryList} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {Tree} from '../../entities/tree.entity';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {Log} from '../../services/log.service';
import {TreeService} from '../../services/tree.service';
import {TranslateService} from '@ngx-translate/core';
import {City} from '../../entities/city.entity';
import {MapMarker} from '../../interfaces/map-marker.entity';

@Component({
  selector: 'ut-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.less']
})
export class TreeListComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(TreeListComponent);

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
    this.loadTreeList();
  }

  /**
   * Load all cities & trees.
   */
  public loadTreeList(): void {
    this.loadTrees(() => {
      this.displayTrees = this.availableTrees;
      this.updateCities();
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
  public setTreeSearchInput(searchInput: string): void {

    this.selectedTree = null;
    if (!searchInput) {
      this.displayTrees = this.availableTrees;
      this.updateCities();
      return;
    }

    const idInput = Number(searchInput);
    if (!Number.isNaN(idInput)) {
      this.displayTrees = this.availableTrees.filter((tree: TreeFrontend) => {
        return tree.id === idInput;
      });
      this.updateCities();
      return;
    }

    this.displayTrees = this.availableTrees.filter((tree: TreeFrontend) => {
        const translationKey = ('tree.species.' + tree.species).toLowerCase();
        return this.translateService.instant(translationKey).toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.street.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.city.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
      });
    this.updateCities();

  }

  /**
   * Called when a tree is selected in the map.
   * @param {MapMarker} newSelectedTree tree that was newly selected
   */
  public selectTreeOnMap(newSelectedTree: MapMarker) {
    this.treeSearchInput = (<TreeFrontend> newSelectedTree).getId() + '';
    this.setTreeSearchInput(this.treeSearchInput);
    this.selectedTree = <TreeFrontend> newSelectedTree;
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
