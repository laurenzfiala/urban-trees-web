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
import VectorTileOptions = olx.source.VectorTileOptions;
import TileEvent = ol.source.TileEvent;
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';

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
  public trees: Array<TreeFrontend>;

  /**
   * The map to display.
   */
  private map: OlMap;

  /**
   * The layer of map markers.
   */
  private mapMarkerLayer: VectorLayer;

  constructor(private observationsService: PhenologyObservationService,
              private environmentService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {
    this.load();
  }

  public ngOnDestroy(): void {
    this.saveTreeSelection();
  }

  /**
   * Load available trees and initialize the map.
   */
  private load() {

    this.setStatus(StatusKey.MAP, StatusValue.IN_PROGRESS);
    this.loadTrees(() => {

      let alreadySelected = this.observationsService.selectedTree;
      if (alreadySelected) {
        this.selectTree(alreadySelected.id);
      }

      this.initMap();
    });

  }

  /**
   * Initialize the map with markers for all loaded trees.
   */
  private initMap() {

    if (this.map) {
      this.map.removeLayer(this.mapMarkerLayer);
    }

    let markerSource = new VectorSource();

    let iconStyle = new Style({
      image: new Icon( ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: '/assets/img/map_marker.svg'
      }))
    });

    let iconStyleHighlight = new Style({
      image: new Icon( ({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        opacity: 1,
        src: '/assets/img/map_marker_highlight.svg'
      }))
    });

    this.trees.forEach((value, index, array) => {

      let iconFeature = new Feature({
        geometry: new Point(OlProj.fromLonLat([value.location.coordinates.x, value.location.coordinates.y], 'EPSG:3857')),
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

    this.mapMarkerLayer = new VectorLayer({
      source: markerSource
    });

    let view = new OlView({
      center: OlProj.fromLonLat([13.0432, 47.8103], 'EPSG:3857'),
      zoom: 8,
    });

    if (this.map) {
      this.map.addLayer(this.mapMarkerLayer);
      this.map.changed();
      return;
    }

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
      layers: [layer, this.mapMarkerLayer],
      view: view
    });

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

    if (this.trees) {
      successCallback();
      return;
    }

    this.setStatus(StatusKey.TREES, StatusValue.IN_PROGRESS);
    this.observationsService.loadTrees((trees: Array<Tree>) => {
      this.trees = <Array<TreeFrontend>>trees;
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      successCallback();
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
    });

  }

  /**
   * Select a single tree to continue observation.
   * @param {number} treeId id of that tree
   */
  public selectTree(treeId: number) {

    for (let t of this.trees) {
      if (t.id === treeId) {
        t.selected = true;
      } else {
        t.selected = false;
      }
    }
    this.initMap();
    this.observationsService.setContinue(true);

  }

  /**
   * Save the currently selected tree to the service, so the next
   * step can access its informations.
   */
  private saveTreeSelection() {

    if (!this.trees) {
      return;
    }

    for (let t of this.trees) {
      if (t.selected) {
        this.observationsService.selectTree(t);
        return;
      }
    }

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
