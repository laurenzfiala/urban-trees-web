import {ChangeDetectionStrategy, Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {TreeService} from '../../../services/tree.service';
import {AdminService} from '../../../services/admin/admin.service';
import {City} from '../../../entities/city.entity';
import {AbstractComponent} from '../../../../shared/components/abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../../shared/entities/api-error.entity';
import {MapMarker} from '../../../interfaces/map-marker.interface';
import {Tree} from '../../../entities/tree.entity';
import {Coordinates} from '../../../entities/coordinates.entity';
import {TreeFrontend} from '../../../entities/tree-frontend.entity';
import {TreeSpecies} from '../../../entities/tree-species.entity';
import {TreeGenus} from '../../../entities/tree-genus.entity';
import {Beacon} from '../../../entities/beacon.entity';
import {BeaconSettings} from '../../../entities/beacon-settings.entity';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';
import {Location} from '../../../entities/location.entity';
import {TreeLight} from '../../../entities/tree-light.entity';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'ut-admin-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class AdminTreeComponent extends AbstractComponent implements OnInit {

  /**
   * Query param to preselect a tree.
   */
  private static QUERY_PARAMS_SELECTED_TREE = 'tree';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public availableTrees: Array<TreeFrontend>;

  public tree: TreeFrontend;
  public savedTree: TreeFrontend;

  private newCityModalRef: BsModalRef;
  public newCity: City;

  private newBeaconModalRef: BsModalRef;
  public newBeacon: Beacon;

  public cities: Array<City>;
  public species: Array<TreeSpecies>;
  public marker: MapMarker;

  public showTreeSelect: boolean = false;

  constructor(private treeService: TreeService,
              private phenobsService: PhenologyObservationService,
              private adminService: AdminService,
              private modalService: BsModalService,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params: any) => {

      const selectTreeIdVal = Number(params[AdminTreeComponent.QUERY_PARAMS_SELECTED_TREE]);
      this.load(selectTreeIdVal);

    });

  }

  /**
   * Load all needed data.
   */
  public load(preselectTreeId?: number): void {
    this.loadTrees(preselectTreeId);
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
      this.showTreeSelect = true;
    } else {
      this.tree = new TreeFrontend(
        new Tree(
          0,
          new Location(
            0,
            new Coordinates(
              0,
              0,
              'EPSG:900913'
            ),
            '',
            new City(null)
          ),
          new TreeSpecies(
            0,
            '',
            new TreeGenus(
              0,
              ''
            )
          ),
          9999,
          false,
          []
        )
      );
      this.marker = null;
      this.showTreeSelect = false;
    }

  }

  public onDiscard(): void {
    this.showTreeSelect = false;
    this.onSelectedTreeChange(null);
    this.deleteStatus(StatusKey.NEW_CITY);
    this.deleteStatus(StatusKey.SAVE_TREE);
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
      this.adminService.modifyTree(this.tree, (result: Tree) => {
        this.savedTree = TreeFrontend.fromTree(result);
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.SUCCESSFUL);
      }, (error, apiError) => {
        this.setStatus(StatusKey.SAVE_TREE, StatusValue.FAILED);
      });

    } else { // create new tree

      this.setStatus(StatusKey.SAVE_TREE, StatusValue.IN_PROGRESS);
      this.adminService.addTree(this.tree, (result: Tree) => {
        this.savedTree = TreeFrontend.fromTree(result);
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
      this.setStatus(StatusKey.NEW_BEACON_ERROR, apiError.clientErrorCode);
    });

  }

  private loadTrees(selectTree?: number): void {

    this.setStatus(StatusKey.LOAD_TREES, StatusValue.IN_PROGRESS);
    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => t && TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.LOAD_TREES, StatusValue.SUCCESSFUL);
      if (selectTree) {
        this.onSelectedTreeChange(this.availableTrees.find((t: TreeFrontend) => t.id === selectTree));
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
    this.newBeacon.tree = new TreeLight(this.tree.id);
    this.newBeacon.settings = new BeaconSettings();
    this.newBeacon.location = this.tree.location;

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
  NEW_CITY,
  NEW_BEACON,
  NEW_BEACON_ERROR,
  SAVE_TREE

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  TREE_MARKER_NOT_SET

}
