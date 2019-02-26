import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {BsModalService} from 'ngx-bootstrap/modal';
import {TreeService} from '../../../services/tree.service';
import {AdminService} from '../../../services/admin/admin.service';
import {City} from '../../../entities/city.entity';
import {AbstractComponent} from '../../abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../entities/api-error.entity';
import {MapMarker} from '../../../interfaces/map-marker.entity';
import {Tree} from '../../../entities/tree.entity';
import {TreeLocation} from '../../../entities/tree-location.entity';
import {Coordinates} from '../../../entities/coordinates.entity';
import {TreeFrontend} from "../../../entities/tree-frontend.entity";
import {TreeSpecies} from '../../../entities/tree-species.entity';
import {TreeGenus} from '../../../entities/tree-genus.entity';
import {Beacon} from '../../../entities/beacon.entity';
import {BeaconSettings} from '../../../entities/beacon-settings.entity';
import {BeaconListComponent} from '../../beacon-list/beacon-list.component';
import {TreeComponent} from '../../tree/tree.component';
import {MapMarkerDefault} from '../../../entities/map-marker-default.entity';
import Map = ol.Map;
import {PhenologyObservationTypeFrontend} from '../../../entities/phenology-observation-type-frontend.entity';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';

@Component({
  selector: 'ut-admin-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class AdminTreeComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public availableTrees: Array<TreeFrontend>;

  public tree: TreeFrontend;

  private newCityModalRef: BsModalRef;
  private newCity: City;

  private newBeaconModalRef: BsModalRef;
  private newBeacon: Beacon;

  public cities: Array<City>;
  public species: Array<TreeSpecies>;
  public marker: MapMarker;

  public isTreeSaved: boolean = false;

  constructor(private treeService: TreeService,
              private phenobsService: PhenologyObservationService,
              private adminService: AdminService,
              private modalService: BsModalService) {
    super();
  }

  ngOnInit() {
    this.load();
  }

  /**
   * Load all needed data.
   */
  public load(): void {
    this.loadTrees();
    this.loadCities();
    this.loadSpecies();

    this.onSelectedTreeChange(null);
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

  public onSelectedTreeChange(selectedTree: TreeFrontend): void {

    if (selectedTree) {
      this.tree = selectedTree;
      this.marker = selectedTree;
    } else {
      this.tree = new TreeFrontend(
        new Tree(
          0,
          new TreeLocation(
            0,
            new Coordinates(
              0,
              0,
              "EPSG:900913"
            ),
            "",
            new City(null)
          ),
          new TreeSpecies(
            0,
            "",
            new TreeGenus(
              0,
              ""
            )
          ),
          9999,
          false,
          []
        )
      );
      this.marker = null;
    }

  }

  public saveTree(): void {

    if (!this.marker) {
      this.setStatus(StatusKey.SAVE_TREE, StatusValue.TREE_MARKER_NOT_SET);
      return;
    }

    this.tree.location.coordinates.x = this.marker.getCoordsX();
    this.tree.location.coordinates.y = this.marker.getCoordsY();

    if (this.tree.id) { // modify tree

      this.setStatus(StatusKey.SAVE_TREE, StatusValue.IN_PROGRESS);
      this.adminService.modifyTree(this.tree, () => {
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.FAILED);
      });

    } else { // create new tree

      this.setStatus(StatusKey.SAVE_TREE, StatusValue.IN_PROGRESS);
      this.adminService.addTree(this.tree, () => {
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.FAILED);
      });

    }


  }

  public addBeacon(): void {

    this.setStatus(StatusKey.NEW_BEACON, StatusValue.IN_PROGRESS);
    this.adminService.addBeacon(this.newBeacon, () => {
      this.setStatus(StatusKey.NEW_BEACON, StatusValue.SUCCESSFUL);
      this.newBeaconModalRef.hide();
      this.loadTrees(this.tree.id);
    }, (error, apiError) => {
      this.setStatus(StatusKey.NEW_BEACON, StatusValue.FAILED);
    });

  }

  private loadTrees(selectTree?: number): void {

    this.setStatus(StatusKey.LOAD_TREES, StatusValue.IN_PROGRESS);
    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => t && TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.LOAD_TREES, StatusValue.SUCCESSFUL);
      if (selectTree) {
        this.tree = this.availableTrees.find((t: TreeFrontend) => t.id === selectTree);
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_TREES, StatusValue.FAILED);
    });

  }

  private loadCities(selectCity?: City): void {

    this.setStatus(StatusKey.LOAD_CITIES, StatusValue.IN_PROGRESS);
    this.treeService.loadCities((cities: Array<City>) => {
      this.tree.location.city = selectCity;
      this.cities = cities;
      this.setStatus(StatusKey.LOAD_CITIES, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_CITIES, StatusValue.FAILED);
    });

  }

  private loadSpecies(): void {

    this.setStatus(StatusKey.LOAD_SPECIES, StatusValue.IN_PROGRESS);
    this.treeService.loadSpecies((species: Array<TreeSpecies>) => {
      this.species = species;
      this.setStatus(StatusKey.LOAD_SPECIES, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_SPECIES, StatusValue.FAILED);
    });

  }

  public showNewCityModal(modalTemplateRef: TemplateRef<any>): void {
    this.newCityModalRef = this.modalService.show(modalTemplateRef);
    this.newCity = new City(null);
  }

  public showNewBeaconModal(modalTemplateRef: TemplateRef<any>): void {
    this.newBeacon = new Beacon();
    this.newBeacon.treeId = this.tree.id;
    this.newBeacon.settings = new BeaconSettings();

    this.newBeaconModalRef = this.modalService.show(modalTemplateRef);
  }

  public hideNewCityModal(): void {
    this.newCityModalRef.hide();
  }

  public hideNewBeaconModal(): void {
    this.newBeaconModalRef.hide();
  }

  public isNewTree(): boolean {
    return this.tree.id === 0;
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
  LOAD_CITIES,
  LOAD_SPECIES,
  LOAD_PHENOBS_TYPES,
  NEW_CITY,
  NEW_BEACON,
  SAVE_TREE

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  TREE_MARKER_NOT_SET

}
