import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {Log} from '../../../shared/services/log.service';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {SearchService} from '../../services/search.service';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {SubscriptionManagerService} from '../../services/subscription-manager.service';
import {LayoutConfig} from '../../config/layout.config';

/**
 * Component for selecting a tree of the given ones.
 * @author Laurenz Fiala
 * @since 2018/12/26
 */
@Component({
  selector: 'ut-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['../tree-list/tree-list.component.less', './tree-select.component.less']
})
export class TreeSelectComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static SUBSCRIPTION_TAG = 'tree-select';

  private static LOG: Log = Log.newInstance(TreeSelectComponent);

  /**
   * Event emitter triggered upon (de-)selecting a new/different tree.
   * Deselecting emits null.
   * Note: isAsync is used to update the parent and trigger another changedetection.
   *       see https://stackoverflow.com/questions/44691745/angular-4-expressionchangedafterithasbeencheckederror
   */
  @Output()
  public selectedTreeChange: EventEmitter<TreeFrontend> = new EventEmitter<TreeFrontend>(true);

  /**
   * Holds the currently selected tree.
   */
  private selectedTreeInternal: TreeFrontend;

  @Input() set selectedTree(value: TreeFrontend) {
    this.selectedTreeInternal = value;
    this.updateResults(false);
  }

  get selectedTree(): TreeFrontend {
    return this.selectedTreeInternal;
  }

  /**
   * Wheter or not to preselect the first tree in the list.
   * Input "selectedTree" overrides this if it has an id != 0 and is non-falsy.
   */
  @Input()
  public preselectFirstTree: boolean = false;

  /**
   * Once loaded, contains all trees available for observation.
   */
  private availableTreesInternal: Array<TreeFrontend>;

  @Input() set availableTrees(value: Array<TreeFrontend>) {
    this.availableTreesInternal = value;
    this.updateSelectedTree();
    this.updateResults(false);
  }

  get availableTrees(): Array<TreeFrontend> {
    return this.availableTreesInternal;
  }

  /**
   * Whether to allow deselecting selected trees.
   */
  @Input()
  public allowDeselect: boolean = false;

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
  public currentDisplayPage: number = 0;

  /**
   * Amount of pages to display.
   */
  public currentDisplayPages: number = 0;

  /**
   * Current tree search input.
   */
  public treeSearchInput: string;

  /**
   * Current pagination page size.
   */
  private pageSize: number;

  constructor(private envService: EnvironmentService,
              private searchService: SearchService,
              private subs: SubscriptionManagerService,
              private bpObserver: BreakpointObserver) {
    super();
  }

  public ngOnInit(): void {

    this.subs.register(this.bpObserver.observe(LayoutConfig.LAYOUT_MEDIA_STEPS).subscribe((state: BreakpointState) => {
      let pageSize = 2;
      if (state.breakpoints[LayoutConfig.LAYOUT_MEDIA_MD]) {
        pageSize = 4;
      } else if (state.breakpoints[LayoutConfig.LAYOUT_MEDIA_LG] || state.breakpoints[LayoutConfig.LAYOUT_MEDIA_XL]) {
        pageSize = 6;
      }
      this.pageSize = pageSize;
      this.updateResults(false);
    }), TreeSelectComponent.SUBSCRIPTION_TAG);

    this.updateSelectedTree();
    this.updateResults(false);

  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(TreeSelectComponent.SUBSCRIPTION_TAG);
  }

  /**
   * Set the #displayTrees array using the correct pagination.
   * @param {Array<TreeFrontend>} trees the filtered trees to display.
   */
  private setDisplayTreesPaginated(trees: Array<TreeFrontend>) {

    if (!this.availableTreesInternal || !this.pageSize) {
      return;
    }

    this.currentDisplayPages = Math.ceil(trees.length / this.pageSize);
    this.displayTreePagination = trees.length > this.pageSize;

    let paginatedArray = new Array<Array<TreeFrontend>>();

    let page = 0;
    for (let i = 0; i < trees.length; i += this.pageSize) {
      paginatedArray[page] = trees.slice(i, i + this.pageSize);
      page++;
    }

    if (this.selectedTree) {
      const selectedTreeIndex = trees.findIndex(value => value.id === this.selectedTree.id);
      if (selectedTreeIndex === -1) {
        this.currentDisplayPage = 0;
      } else {
        this.currentDisplayPage = Math.floor( selectedTreeIndex / this.pageSize);
      }
    } else {
      this.currentDisplayPage = 0;
    }
    this.displayTrees = paginatedArray;

  }


  /**
   * Update displayTrees by current filter.
   * @param {boolean} debounce (optional) whether to wait a few ms if a new input is given
   */
  public updateResults(debounce: boolean = true): void {

    const searchInput = this.treeSearchInput;
    if (!searchInput) {
      this.setDisplayTreesPaginated(this.availableTreesInternal);
      return;
    }

    let fn = () => {
      if (this.treeSearchInput !== searchInput) {
        return;
      }
      this.searchService.search(this.availableTreesInternal, searchInput, 'tree-list', undefined, 2).then(results => {
        this.setDisplayTreesPaginated(results);
      });
    };

    if (debounce) {
      // debounce search input (for improved performance)
      setTimeout(fn, this.envService.searchDebounceMs);
    } else {
      fn();
    }

  }

  /**
   * Change the currently displayed tree list page.
   * @param {number} displayIndex index to display.
   */
  public displayTreePage(displayIndex: number): void {

    if (displayIndex < 0 || displayIndex >= this.displayTrees.length) {
      return;
    }
    this.currentDisplayPage = displayIndex;

  }

  /**
   * Select or deselect a single tree to continue observation.
   * @param {number} treeId id of that tree
   */
  public toggleTree(treeId: number, noDeselect: boolean = false): void {

    if (this.availableTreesInternal === undefined) {
      return;
    }

    const newSelection = this.availableTreesInternal.find(value => value.id === treeId);
    if (this.allowDeselect && !noDeselect && newSelection.id === this.selectedTree?.id) {
      this.selectedTreeInternal = null;
    } else {
      this.selectedTreeInternal = newSelection;
    }

    this.selectedTreeChange.emit(this.selectedTree);

  }

  /**
   * Updates the selected tree if the availableTrees array changes or
   * preselectFirstTree is changed.
   */
  private updateSelectedTree(): void {

    if (this.selectedTree) {
      this.toggleTree(this.selectedTree.id, true);
    } else if ((!this.selectedTree || this.selectedTree.id === 0) && this.preselectFirstTree && this.availableTreesInternal.length >= 1) {
      this.toggleTree(this.availableTreesInternal[0].id, true);
    }

  }

}
