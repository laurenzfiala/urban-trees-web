import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Log} from '../../../shared/services/log.service';
import OlMap from 'ol/map';
import OlView from 'ol/view';
import VectorLayer from 'ol/layer/vector';
import {EnvironmentService} from '../../../shared/services/environment.service';
import VectorTile from 'ol/layer/vectortile';
import VectorTileSource from 'ol/source/vectortile';
import MVT from 'ol/format/mvt';
import VectorSource from 'ol/source/vector';
import Style from 'ol/style/style';
import Icon from 'ol/style/icon';
import Feature from 'ol/feature';
import Point from 'ol/geom/point';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import OlProj from 'ol/proj';
import OlXYZ from 'ol/source/xyz';
import OlTileLayer from 'ol/layer/tile';
import {MapMarker} from '../../interfaces/map-marker.interface';
import {MapMarkerDefault} from '../../entities/map-marker-default.entity';

@Component({
  selector: 'ut-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(MapComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private markersInternal: Array<MapMarker>;

  /**
   * Tree currently selected.
   */
  private selectedMarkerInternal: MapMarker;

  /**
   * Emit tree when the selection is changed.
   */
  @Output()
  public selectedMarkerChange: EventEmitter<MapMarker> = new EventEmitter<MapMarker>();

  /**
   * Whether the use may set a new pin on the map.
   */
  public userSetPinInternal: boolean = false;

  @Input()
  set userSetPin(value: boolean) {
    if (value !== this.userSetPinInternal) {
      this.userSetPinInternal = value;
      if (!value) {
        this.markers = [];
      }
    }
  }

  get userSetPin(): boolean {
    return this.userSetPinInternal;
  }

  /**
   * Whether a marker can be set at all (true, default)
   * or not (false).
   */
  public enabledInternal: boolean = true;

  @Input()
  set enabled(value: boolean) {
    if (value !== this.enabledInternal) {
      this.enabledInternal = value;
    }
  }

  get enabled(): boolean {
    return this.enabledInternal;
  }

  /**
   * Whether to use the activator or not.
   * If this is set to true, require the user to click inside the map once
   * before they are able to interact. This is needed for better UX on mobile
   * devices.
   * Defaults to true.
   */
  @Input()
  public useActivator: boolean = true;

  /**
   * Translation id of error text to be shown if the map
   * could not be loaded.
   */
  @Input()
  public errorText: string = 'map.error_default_text';

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
   * Whether the map can currently be used, or its disabled.
   */
  public isMapEnabled: boolean = false;

  /**
   * Screen coordinates of the last mouse-down.
   * Used to track whether the mouse was moved during a click.
   */
  public mouseDownCoords: number[];

  constructor(private environmentService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {
    this.loadMap();
  }

  @Input()
  set markers(markers: Array<MapMarker>) {
    if (!markers) {
      return;
    }
    this.markersInternal = markers;
    this.updateMapMarkers();
  }

  get markers(): Array<MapMarker> {
    return this.markersInternal;
  }

  @Input()
  set selectedMarker(marker: MapMarker) {

    if (marker === this.selectedMarkerInternal) {
      return;
    }

    if (this.userSetPin) {
      if (marker) {
        this.markers = [marker];
      } else {
        this.markers = [];
      }
    }
    if (marker) {
      this.centerMarker(marker);
    }
    this.selectedMarkerInternal = marker;
    this.updateMapMarkers();

  }

  get selectedMarker(): MapMarker {
    return this.selectedMarkerInternal;
  }

  /**
   * Load available trees and initialize the map.
   */
  public loadMap() {

    // TODO make this optional input
    this.mapView = new OlView({
      center: OlProj.fromLonLat([13.0432, 47.8103], 'EPSG:3857'),
      zoom: 8,
      enableRotation: false
    });

    this.setStatus(StatusKey.MAP, StatusValue.IN_PROGRESS);

    this.initMap();
    this.updateMapMarkers();

    if (this.selectedMarker) {
      this.centerMarker(this.selectedMarker);
    }

  }

  /**
   * Initialize the map with markers.
   */
  private initMap() {

    let layer = new VectorTile({
      source: new VectorTileSource({
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

    if (this.markers) {

      Array.from(this.markers).sort((a, b) => { // bring selection to front
        if (this.mapMarkerEquals(a, this.selectedMarkerInternal)) {
          return 1;
        } else if (this.mapMarkerEquals(b, this.selectedMarkerInternal)) {
          return -1;
        } else {
          return 0;
        }
      }).forEach((value, index, array) => {

        let iconFeature = new Feature({
          geometry: new Point([value.getCoordsX(), value.getCoordsY()]),
          id: value.getId()
        });


        if (this.mapMarkerEquals(this.selectedMarkerInternal, value)) {
          iconFeature.setStyle(iconStyleHighlight);
        } else {
          iconFeature.setStyle(iconStyle);
        }

        markerSource.addFeature(iconFeature);

      });

    }

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
   * Compares two MapMarker by their ID.
   * Null-safe.
   * @param a MapMarker to compare to b
   * @param bMapMarker to compare to a
   */
  private mapMarkerEquals(a: MapMarker, b: MapMarker): boolean {
    if (!a || !b) {
      return false;
    }
    return a.getId() === b.getId();
  }

  /**
   * Add a new marker to the map and emit #selectedMarkerChange.
   * @see #markers
   * @param event the mouse click event on the map
   */
  private addMarkerFromEvent(event: MouseEvent): void {

    if (!this.userSetPin) {
      return;
    }

    let coords: any = this.map.getEventCoordinate(event);
    MapComponent.LOG.trace('Creating new map marker at: ' + coords);
    this.markers = [new MapMarkerDefault(coords[0], coords[1])];
    this.selectMarker(this.markers[0].getId());

  }

  public onMapMouseDown(event: MouseEvent) {
    if (!this.enabled) {
      return;
    }
    this.mouseDownCoords = [event.clientX, event.clientY];
  }

  public onMapMouseUp(event: MouseEvent) {
    if (!this.enabled) {
      return;
    }

    if (!this.mouseDownCoords || (this.mouseDownCoords[0] === event.clientX && this.mouseDownCoords[1] === event.clientY)) {
      this.onMapClick(event);
    }
    this.mouseDownCoords = undefined;
  }

  /**
   * Triggered when the map is clicked.
   * @param {MouseEvent} event
   */
  public onMapClick(event: MouseEvent) {

    MapComponent.LOG.trace('Clicked map.');

    let found = <Array<any>>this.map.getFeaturesAtPixel([event.offsetX, event.offsetY]);
    if (!found) {
      this.addMarkerFromEvent(event);
      return;
    }

    for (let f of found) {

      if (!(f instanceof Feature)) {
        continue;
      }

      this.selectMarker(f['values_'].id);

    }

  }

  /**
   * Called upon error with the map tiles.
   * Deconstructs the map and shows an error info.
   * @param {ol.source.TileEvent} tileEvent The event with affected tile info
   */
  public onMapTileError(tileEvent: any) {

    if (this.map) {
      this.map.setTarget(null);
      this.map = null;
    }

    let tile = tileEvent.tile;
    MapComponent.LOG.warn('Failed to load map tile with coordinates ' + tile.getTileCoord());
    this.setStatus(StatusKey.MAP, StatusValue.FAILED);

  }

  /**
   * Triggered when a map tile is loaded.
   */
  public onMapTileLoaded() {

    MapComponent.LOG.trace('Map tile successfully loaded.');
    if (!this.hasStatus(StatusKey.MAP, StatusValue.FAILED)) {
      this.setStatus(StatusKey.MAP, StatusValue.SUCCESSFUL);
    }

  }

  /**
   * Select a single marker and emit a change event through #selectedMarkerChange.
   * @param {number} id id of that marker
   */
  public selectMarker(id: number) {

    this.selectedMarkerInternal = this.markers.find(value => value.getId() === id);

    this.updateMapMarkers();
    this.selectedMarkerChange.emit(this.selectedMarker);

  }


  /**
   * Center the given MapMarker in the viewport.
   * @param {MapMarker} marker The tree to be centered.
   */
  public centerMarker(marker: MapMarker) {

    if (!this.mapView) {
      return;
    }

    MapComponent.LOG.trace('Centering marker with id ' + marker.getId() + '.');
    this.mapView.centerOn(
      [marker.getCoordsX(), marker.getCoordsY()],
      this.map.getSize(),
      [(this.map.getSize()[0] / 2), (this.map.getSize()[1] / 2)]
    );

  }

}

export enum StatusKey {

  MAP

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
