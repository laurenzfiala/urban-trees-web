import {Component, OnDestroy, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';

import OlMap from 'ol/map';
import OlView from 'ol/view';
import OlProj from 'ol/proj';
import {default as VectorLayer} from 'ol/layer/vector';
import {default as VectorSource} from 'ol/source/vector';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import VectorTile from 'ol/layer/vectortile';
import VectorTileSource from 'ol/source/vectortile';
import MVT from 'ol/format/mvt';
import {Tree} from '../../../../entities/tree.entity';
import {AbstractComponent} from '../../../abstract.component';
import {Log} from '../../../../services/log.service';
import {TreeFrontend} from '../../../../entities/tree-frontend.entity';
import {EnvironmentService} from '../../../../services/environment.service';
import {PhenologyDatasetFrontend} from '../../../../entities/phenology-dataset-frontend.entity';
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';
import {TranslateService} from '@ngx-translate/core';
import VectorTileOptions = olx.source.VectorTileOptions;
import TileEvent = ol.source.TileEvent;

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
   * The map to display.
   */
  private map: OlMap;

  /**
   * The current view on the map.
   * Used to manipulate zooming, centering, etc.
   */
  private mapView: OlView;

  /**
   * The layer of map markers.
   */
  private mapMarkerLayer: VectorLayer;

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

    this.mapView = new OlView({
      center: OlProj.fromLonLat([13.0432, 47.8103], 'EPSG:3857'),
      zoom: 8,
      enableRotation: false
    });

    this.setStatus(StatusKey.MAP, StatusValue.IN_PROGRESS);
    this.loadTrees(() => {

      let alreadySelected = this.observationsService.selectedTree;
      if (alreadySelected) {
        this.selectTree(alreadySelected.id);
      }

      this.initMap();
      this.updateMapMarkers();
    });

  }

  /**
   * Initialize the map with markers for all loaded trees.
   */
  private initMap() {

    let layer = new VectorTile({
      source: new VectorTileSource(<VectorTileOptions>{
        format: new MVT(),
        url: this.environmentService.endpoints.mapHost + '/data/v3/{z}/{x}/{y}.pbf',
        projection: null
      }),
      renderOrder: null
    });

    layer.getSource().on('tileloaderror', (tile) => {
      this.onMapTileError(tile);
    });

    layer.getSource().on('tileloadend', () => {
      this.onMapTileLoaded();
    });

    let source = new OlXYZ({
      url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'
    });

    let tileLayer = new OlTileLayer({
      source: source
    });

    tileLayer.getSource().on('tileloadend', () => {
      this.onMapTileLoaded();
    });

    this.map = new OlMap({
      target: 'map',
      layers: [tileLayer],
      view: this.mapView
    });

  }

  /**
   * Update the maps' markers to project what the user selected.
   */
  private updateMapMarkers() {

    if (this.map) {
      this.map.removeLayer(this.mapMarkerLayer);
    }

    let markerSource = new VectorSource();

    let iconStyle = new Style({
      image: new Icon( ({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: '/assets/img/map_marker.svg'
      }))
    });

    let iconStyleHighlight = new Style({
      image: new Icon( ({
        anchor: [0.5, 1],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 1,
        src: '/assets/img/map_marker_highlight.svg'
      }))
    });

    Array.from(this.availableTrees).sort((a, b) => {
      if (a.selected) {
        return 1;
      } else {
        return 0;
      }
    }).forEach((value, index, array) => {

      let iconFeature = new Feature({
        geometry: new Point([value.location.coordinates.x, value.location.coordinates.y]),
        treeId: value.id,
        selected: value.selected
      });


      if (value.selected) {
        iconFeature.setStyle(iconStyleHighlight);
      } else {
        iconFeature.setStyle(iconStyle);
      }

      markerSource.addFeature(iconFeature);

    });

    this.mapMarkerLayer = new VectorLayer({
      source: markerSource
    });

    if (this.map) {
      this.map.addLayer(this.mapMarkerLayer);
      this.map.changed();
      return;
    }

  }

  /**
   * Triggered when the map is clicked.
   * @param {MouseEvent} event
   */
  public onMapClick(event: MouseEvent) {

    AInfoComponent.LOG.trace('Clicked map.');

    let found = <Array<any>>this.map.getFeaturesAtPixel([event.offsetX, event.offsetY]);
    if (!found) {
      return;
    }

    for (let f of found) {

      if (!(f instanceof Feature)) {
        continue;
      }

      this.selectTree(f['values_'].treeId);

    }

  }

  /**
   * Called upon error with the map tiles.
   * Deconstructs the map and shows an error info.
   * @param {ol.source.TileEvent} tileEvent The event with affected tile info
   */
  public onMapTileError(tileEvent: TileEvent) {

    if (this.map) {
      this.map.setTarget(null);
      this.map = null;
    }

    let tile = tileEvent.tile;
    AInfoComponent.LOG.warn('Failed to load map tile with coordinates ' + tile.getTileCoord());
    this.setStatus(StatusKey.MAP, StatusValue.FAILED);

  }

  /**
   * Triggered when a map tile is loaded.
   */
  public onMapTileLoaded() {

    AInfoComponent.LOG.trace('Map tile successfully loaded.');
    if (!this.hasStatus(StatusKey.MAP, StatusValue.FAILED)) {
      this.setStatus(StatusKey.MAP, StatusValue.SUCCESSFUL);
    }

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
      this.availableTrees = <Array<TreeFrontend>>trees;
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
    this.updateMapMarkers();

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
   * Center the given tree on the map.
   * @param {TreeFrontend} tree The tree to be centered.
   */
  public centerTree(tree: TreeFrontend) {

    AInfoComponent.LOG.trace('Centering tree with id ' + tree.id + '.');
    this.mapView.centerOn(
      [tree.location.coordinates.x, tree.location.coordinates.y],
      this.map.getSize(),
      [(this.map.getSize()[0] / 2), (this.map.getSize()[1] / 2)]
    );

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

  TREES,
  MAP

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
