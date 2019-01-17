import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../abstract.service';
import {Log} from '../log.service';
import {EnvironmentService} from '../environment.service';
import {Tree} from '../../entities/tree.entity';
import {ApiError} from '../../entities/api-error.entity';
import {City} from '../../entities/city.entity';
import {Beacon} from '../../entities/beacon.entity';

/**
 * Service for backend calls on the admin pages.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
@Injectable()
export class AdminService extends AbstractService {

  private static LOG: Log = Log.newInstance(AdminService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Submit new city to the backend.
   * @param tree the new city to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addCity(city: City,
                  successCallback: (city: City) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving new city to ' + this.envService.endpoints.addCity + ' ...');

    this.http.post(this.envService.endpoints.addCity, city)
      .timeout(this.envService.defaultTimeout)
      .map(c => City.fromObject(c))
      .subscribe((city: City) => {
        successCallback(city);
      }, (e: any) => {
        AdminService.LOG.error('Could not save city: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new tree to the backend.
   * @param tree the tree to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addTree(tree: Tree,
                  successCallback: () => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving tree to ' + this.envService.endpoints.addTree + ' ...');

    this.http.post(this.envService.endpoints.addTree, tree)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit modified tree to the backend.
   * @param tree the tree to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public modifyTree(tree: Tree,
                  successCallback: () => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving tree (modified) to ' + this.envService.endpoints.addTree + ' ...');

    this.http.post(this.envService.endpoints.modifyTree(tree.id), tree)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree (modified): ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new beacon to the backend.
   * @param beacon The beacon to insert.
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addBeacon(beacon: Beacon,
                   successCallback: () => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving beacon to ' + this.envService.endpoints.addBeacon + ' ...');

    this.http.post(this.envService.endpoints.addBeacon, beacon)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save beacon: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Delete beacon from the backend.
   * @param beacon The id of the beacon to delete
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public deleteBeacon(beaconId: number,
                   successCallback: () => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.deleteBeacon(beaconId);
    AdminService.LOG.debug('Deleting beacon - ' +  + ' ...');

    this.http.delete(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete beacon: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

}
