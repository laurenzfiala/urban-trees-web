import {Component, OnInit, TemplateRef} from '@angular/core';
import {Beacon} from '../../../../entities/beacon.entity';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AbstractComponent} from '../../../abstract.component';
import {AdminService} from '../../../../services/admin/admin.service';
import {MapMarker} from '../../../../interfaces/map-marker.entity';
import {City} from '../../../../entities/city.entity';
import {TreeFrontend} from '../../../../entities/tree-frontend.entity';
import {TreeSpecies} from '../../../../entities/tree-species.entity';
import {TreeService} from '../../../../services/tree.service';
import {PhenologyObservationService} from '../../../../services/phenology/observation/phenology-observation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../../entities/api-error.entity';
import {Tree} from '../../../../entities/tree.entity';
import {BeaconFrontend} from '../../../../entities/beacon-frontend.entity';
import {BeaconStatus} from '../../../../entities/beacon-status.entity';
import {BeaconService} from '../../../../services/beacon.service';
import {TreeLight} from '../../../../entities/tree-light.entity';
import {Location} from '../../../../entities/location.entity';
import {Coordinates} from '../../../../entities/coordinates.entity';
import {ActivatedRoute} from '@angular/router';
import {BeaconSettings} from '../../../../entities/beacon-settings.entity';

@Component({
  selector: 'ut-admin-beacon-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['../../tree/tree.component.less', './manage.component.less']
})
export class AdminBeaconManageComponent extends AbstractComponent implements OnInit {

  /**
   * Query param to preselect a beacon.
   */
  private static QUERY_PARAMS_SELECTED_BEACON = 'beacon';

  /**
   * Query param to preselect an associated tree.
   */
  private static QUERY_PARAMS_SELECTED_ASSOCTREE = 'assocTree';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public availableBeacons: Array<BeaconFrontend>;
  public availableTrees: Array<TreeFrontend>;

  /**
   * Beacons that's being edited.
   */
  public beacon: BeaconFrontend;
  public savedBeacon: BeaconFrontend;
  public assocTree: TreeLight;

  private newCityModalRef: BsModalRef;
  public newCity: City;
  public cities: Array<City>;

  public marker: MapMarker;

  public showBeaconSelect: boolean = false;
  public showTreeSelect: boolean = false;
  public showLocation: boolean = false;

  constructor(private treeService: TreeService,
              private beaconService: BeaconService,
              private phenobsService: PhenologyObservationService,
              private adminService: AdminService,
              private modalService: BsModalService,
              private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {

    this.route.queryParams.subscribe((params: any) => {

      const selectBeaconVal = params[AdminBeaconManageComponent.QUERY_PARAMS_SELECTED_BEACON];
      const selectAssocTreeVal = Number(params[AdminBeaconManageComponent.QUERY_PARAMS_SELECTED_ASSOCTREE]);
      this.load(selectBeaconVal, selectAssocTreeVal);

    });

  }

  /**
   * Load all needed data.
   */
  public load(preselectBeaconDeviceId?: string, selectAssocTreeId?: number): void {
    this.loadBeacons(preselectBeaconDeviceId);
    this.loadTrees(selectAssocTreeId);
    this.loadCities();

    this.onSelectedBeaconChange(null);
  }

  public addCity(): void {

    this.setStatus(StatusKey.NEW_CITY, StatusValue.IN_PROGRESS);
    this.adminService.addCity(this.newCity, (city: City) => {
      this.setStatus(StatusKey.NEW_CITY, StatusValue.SUCCESSFUL);
      this.newCityModalRef.hide();
      this.loadCities(city);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_CITY, StatusValue.FAILED);
    });

  }

  public onSelectedBeaconChange(selectedBeacon: BeaconFrontend): void {

    if (selectedBeacon) {
      this.beacon = BeaconFrontend.fromObject(selectedBeacon);
      this.assocTree = this.beacon.tree && TreeLight.fromObject(this.beacon.tree);
      this.marker = this.beacon;
      this.showBeaconSelect = true;
      if (this.beacon.tree) {
        this.showTreeSelect = true;
      } else {
        this.showTreeSelect = false;
      }
      this.loadBeaconSettings();
    } else {
      this.beacon = new BeaconFrontend(
        0,
        undefined,
        undefined,
        undefined,
        BeaconStatus.INITIAL,
        new Location(),
        new BeaconSettings()
      );
      this.beacon.settingsLoadingStatus = StatusValue.SUCCESSFUL;
      this.assocTree = null;
      this.marker = null;
      this.showTreeSelect = false;
    }

  }

  public onSelectedTreeChange(selectedTree: TreeFrontend): void {
    this.assocTree = selectedTree && TreeLight.fromObject(selectedTree);
  }

  public onBeaconSelectedMarkerChange(selectedMarker: MapMarker): void {
    this.beacon.location.coordinates = new Coordinates(
      selectedMarker.getCoordsX(),
      selectedMarker.getCoordsY(),
      'EPSG:900913'
    );
    this.marker = selectedMarker;
  }

  public onBeaconLocationTreeLink(linkTreeLocation: boolean): void {

    if (linkTreeLocation) {
      this.beacon.location = this.assocTree.location;
    } else {
      this.beacon.location.id = 0;
    }

  }

  public onDiscard(): void {
    this.showBeaconSelect = false;
    this.onSelectedBeaconChange(null);
    this.deleteStatus(StatusKey.SAVE_BEACON);
  }

  public saveBeacon(): void {

    if (!this.marker) {
      this.setStatus(StatusKey.SAVE_BEACON, StatusValue.BEACON_MARKER_NOT_SET);
      return;
    }

    if (this.assocTree) {
      this.beacon.tree = this.assocTree;
    }

    if (this.beacon.id) { // modify beacon

      this.setStatus(StatusKey.SAVE_BEACON, StatusValue.IN_PROGRESS);
      this.adminService.modifyBeacon(this.beacon, (result: BeaconFrontend) => { // TODO
        this.savedBeacon = BeaconFrontend.fromBeacon(result);
        this.setStatus(StatusKey.SAVE_BEACON, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE_BEACON, StatusValue.FAILED);
      });

    } else { // create new beacon

      this.setStatus(StatusKey.SAVE_BEACON, StatusValue.IN_PROGRESS);
      this.adminService.addBeacon(this.beacon, (result: Beacon) => {
        this.savedBeacon = BeaconFrontend.fromBeacon(result);
        this.setStatus(StatusKey.SAVE_BEACON, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE_BEACON, StatusValue.FAILED);
      });

    }


  }

  private loadTrees(selectTreeById?: number): void {

    this.setStatus(StatusKey.LOAD_TREES, StatusValue.IN_PROGRESS);
    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => t && TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.LOAD_TREES, StatusValue.SUCCESSFUL);
      if (selectTreeById) {
        this.onSelectedTreeChange(this.availableTrees.find((t: TreeFrontend) => t.id === selectTreeById));
        this.showTreeSelect = true;
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_TREES, StatusValue.FAILED);
    });

  }

  private loadBeacons(selectBeaconByDeviceId?: string): void {

    this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.IN_PROGRESS);
    this.beaconService.loadBeacons((beacons: Array<BeaconFrontend>) => {
      this.availableBeacons = beacons;
      this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.SUCCESSFUL);
      if (selectBeaconByDeviceId) {
        this.onSelectedBeaconChange(this.availableBeacons.find((b: BeaconFrontend) => b.deviceId === selectBeaconByDeviceId));
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_BEACONS, StatusValue.FAILED);
    });

  }

  private loadBeaconSettings(): void {

    this.beacon.settingsLoadingStatus = StatusValue.IN_PROGRESS;
    this.treeService.loadBeaconSettings(this.beacon.id, (beaconSettings: BeaconSettings) => {
      this.beacon.settings = beaconSettings;
      this.beacon.settingsLoadingStatus = StatusValue.SUCCESSFUL;
    }, (error, apiError) => {
      this.beacon.settingsLoadingStatus = StatusValue.FAILED;
    });

  }

  private loadCities(selectCity?: City): void {

    this.setStatus(StatusKey.LOAD_CITIES, StatusValue.IN_PROGRESS);
    this.treeService.loadCities((cities: Array<City>) => {
      this.beacon.location.city = selectCity;
      this.cities = cities;
      this.setStatus(StatusKey.LOAD_CITIES, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_CITIES, StatusValue.FAILED);
    });

  }

  public showNewCityModal(modalTemplateRef: TemplateRef<any>): void {
    this.newCityModalRef = this.modalService.show(modalTemplateRef);
    this.newCity = new City(null);
  }

  public hideNewCityModal(): void {
    this.newCityModalRef.hide();
  }

  public isNewBeacon(): boolean {
    return this.beacon.id === 0;
  }

  public compareCities(a: City, b: City) {
    return City.equals(a, b);
  }

  public compareTreeSpecies(a: TreeSpecies, b: TreeSpecies) {
    return TreeSpecies.equals(a, b);
  }

}

export enum StatusKey {

  LOAD_TREES,
  LOAD_BEACONS,
  LOAD_CITIES,
  NEW_CITY,
  SAVE_BEACON

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  BEACON_MARKER_NOT_SET

}
