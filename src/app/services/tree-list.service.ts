import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Tree} from '../entities/tree.entity';
import {ApiError} from '../entities/api-error.entity';
import {EnvironmentService} from './environment.service';
import {AbstractService} from './abstract.service';
import {Log} from './log.service';
import {TreeListStatistics} from '../entities/tree-list-statistics.entity';

/**
 * Service for backend calls on the tree-list
 * page.
 *
 * @author Laurenz Fiala
 * @since 2018/05/22
 */
@Injectable()
export class TreeListService extends AbstractService {

  private static LOG: Log = Log.newInstance(TreeListService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load all available trees.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadStatistics(successCallback: (trees: TreeListStatistics) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeListService.LOG.debug('Loading statistics from ' + this.envService.endpoints.statistics + ' ...');

    this.http.get<TreeListStatistics>(this.envService.endpoints.statistics)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: TreeListStatistics) => {
        successCallback(results);
      }, (e: any) => {
        TreeListService.LOG.error('Could not load statistics: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Load all available trees.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadTrees(successCallback: (trees: Array<Tree>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeListService.LOG.debug('Loading available trees from ' + this.envService.endpoints.allTrees + ' ...');

    this.http.get<Array<Tree>>(this.envService.endpoints.allTrees)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<Tree>) => {
        successCallback(results);
      }, (e: any) => {
        TreeListService.LOG.error('Could not load trees: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * TODO
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadCities(successCallback: (cities: Array<string>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeListService.LOG.debug('Loading cities from ' + this.envService.endpoints.cities + ' ...');

    this.http.get<Array<string>>(this.envService.endpoints.cities)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<string>) => {
        successCallback(results);
      }, (e: any) => {
        TreeListService.LOG.error('Could not load cities: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

}
