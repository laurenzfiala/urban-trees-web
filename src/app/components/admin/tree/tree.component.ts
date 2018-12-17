import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Species} from '../../../entities/species.entity';
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

@Component({
  selector: 'ut-admin-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less']
})
export class AdminTreeComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private newCityModalRef: BsModalRef;
  private newCityName: string;

  public selectedCity: string;
  public cities: Array<City>;

  public selectedSpecies: Species;
  public species: Array<Species>;

  public marker: MapMarker;
  public street: string;

  constructor(private treeService: TreeService,
              private adminService: AdminService,
              private modalService: BsModalService) {
    super();
  }

  ngOnInit() {
    this.loadCities();
    this.loadSpecies();
  }

  public addCity(): void {

    this.setStatus(StatusKey.NEW_CITY, StatusValue.IN_PROGRESS);
    this.adminService.addCity(new City(this.newCityName), () => {
      this.setStatus(StatusKey.NEW_CITY, StatusValue.SUCCESSFUL);
      this.newCityModalRef.hide();
      this.loadCities(this.newCityName);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_CITY, StatusValue.FAILED);
    });

  }

  public addTree(): void {

    if (!this.marker) {
      this.setStatus(StatusKey.NEW_TREE, StatusValue.TREE_MARKER_NOT_SET);
      return;
    }

    this.setStatus(StatusKey.NEW_TREE, StatusValue.IN_PROGRESS);
    this.adminService.addTree(new Tree(
      0,
      new TreeLocation(
        0,
        new Coordinates(
          this.marker.getCoordsX(),
          this.marker.getCoordsY(),
          null
        ),
        null,
        null
      ),
      this.selectedSpecies.id,
      null,
      this.selectedSpecies.genusId,
      null,
      0,
      true,
      []
    ), () => {
      this.setStatus(StatusKey.NEW_TREE, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_TREE, StatusValue.FAILED);
    });

  }

  private loadCities(selectCity?: string): void {

    this.treeService.loadCities((cities: Array<City>) => {
      this.selectedCity = selectCity;
      this.cities = cities;
    });

  }

  private loadSpecies(): void {

    this.treeService.loadSpecies((species: Array<Species>) => {
      this.species = species;
    });

  }

  public showNewCityModal(modalTemplateRef: TemplateRef<any>): void {
    this.newCityModalRef = this.modalService.show(modalTemplateRef);
  }

  public hideNewCityModal(): void {
    this.newCityModalRef.hide();
  }

}

export enum StatusKey {

  NEW_CITY,
  NEW_TREE

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  TREE_MARKER_NOT_SET

}
