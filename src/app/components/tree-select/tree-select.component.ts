import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {AbstractComponent} from "../abstract.component";
import {Log} from "../../services/log.service";
import {TreeFrontend} from "../../entities/tree-frontend.entity";
import {TranslateService} from "@ngx-translate/core";

/**
 * Component for selecting a tree of the given ones.
 * @author Laurenz Fiala
 * @since 2018/12/26
 */
@Component({
  selector: 'ut-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.less']
})
export class TreeSelectComponent extends AbstractComponent implements OnInit, OnChanges {

  private static LOG: Log = Log.newInstance(TreeSelectComponent);

  /**
   * Event emitter triggered upon selecting a new/different tree.
   */
  @Output('selectedTreeChange')
  public selectedTreeChange: EventEmitter<TreeFrontend> = new EventEmitter<TreeFrontend>();

  /**
   * Holds the currently selected tree.
   */
  @Input()
  public selectedTree: TreeFrontend;

  /**
   * Once loaded, contains all trees available for observation.
   */
  private availableTreesInternal: Array<TreeFrontend>;

  @Input() set availableTrees(value: Array<TreeFrontend>) {
    this.availableTreesInternal = value;
    if (this.selectedTree) {
      this.selectTree(this.selectedTree.id);
    }
  }

  /**
   * Whether to show new tree selection.
   * If "new Tree" is selected by the user, selectedTreeChange emits null.
   */
  @Input()
  public selectNewTree: boolean = false;

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
   * Current tree search input.
   */
  public treeSearchInput: string;

  constructor(public translateService: TranslateService) {
    super();
  }

  ngOnInit() {
  }

  ngOnChanges() {
    this.setDisplayTreesPaginated(this.availableTreesInternal);
  }

  /**
   * Set the #displayTrees array using the correct pagination.
   * @param {Array<TreeFrontend>} trees the filtered trees to display.
   */
  private setDisplayTreesPaginated(trees: Array<TreeFrontend>) {

    if (!this.availableTreesInternal) {
      return;
    }

    const minPageSize = 10;
    const pages = 5;
    let pageSize = Math.ceil(this.availableTreesInternal.length / pages);

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
   * Set tree search and filter displayed trees by input.
   * @param {string} searchInput user's tree search input
   */
  public setTreeSearchInput(searchInput: string): void {

    if (!searchInput) {
      this.setDisplayTreesPaginated(this.availableTreesInternal);
      return;
    }

    const idInput = Number(searchInput);
    if (!Number.isNaN(idInput)) {
      this.setDisplayTreesPaginated(this.availableTreesInternal.filter((tree: TreeFrontend) => {
        return tree.id === idInput;
      }));
      return;
    }

    this.setDisplayTreesPaginated(
      this.availableTreesInternal.filter((tree: TreeFrontend) => {
        const translationKey = ('tree.species.' + tree.species).toLowerCase();
        return this.translateService.instant(translationKey).toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.street.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1 ||
          tree.location.city.name.toLowerCase().indexOf(searchInput.toLowerCase()) !== -1;
      })
    );

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
   * Select a single tree to continue observation.
   * @param {number} treeId id of that tree
   */
  public selectTree(treeId: number) {

    if (this.availableTreesInternal === undefined){
      return;
    }

    this.selectedTree = this.availableTreesInternal.find(value => value.id === treeId);
    this.selectedTreeChange.emit(this.selectedTree);

  }

}
