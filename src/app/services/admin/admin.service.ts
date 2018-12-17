import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../abstract.service';
import {Log} from '../log.service';
import {EnvironmentService} from '../environment.service';
import {Tree} from '../../entities/tree.entity';
import {ApiError} from '../../entities/api-error.entity';
import {City} from '../../entities/city.entity';

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
                  successCallback: () => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving new city to ' + this.envService.endpoints.addCity + ' ...');

    this.http.post(this.envService.endpoints.addCity, city)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save city: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new tree to the backend.
   * @param tree the new tree to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addTree(tree: Tree,
                  successCallback: () => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving new tree to ' + this.envService.endpoints.addTree + ' ...');

    this.http.post(this.envService.endpoints.addTree, tree)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

}
