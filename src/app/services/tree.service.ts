import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Tree} from '../entities/tree.entity';
import {ApiError} from '../entities/api-error.entity';
import {EnvironmentService} from './environment.service';
import {AbstractService} from './abstract.service';
import {Log} from './log.service';
import {TreeListStatistics} from '../entities/tree-list-statistics.entity';
import {Announcement} from '../entities/announcement.entity';
import {BeaconData} from '../entities/beacon-data.entity';

/**
 * Service for backend calls on the tree-list
 * page.
 *
 * @author Laurenz Fiala
 * @since 2018/05/22
 */
@Injectable()
export class TreeService extends AbstractService {

  private static LOG: Log = Log.newInstance(TreeService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load all available trees.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadStatistics(successCallback: (statistics: TreeListStatistics) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeService.LOG.debug('Loading statistics from ' + this.envService.endpoints.statistics + ' ...');

    this.http.get<TreeListStatistics>(this.envService.endpoints.statistics)
      .timeout(this.envService.defaultTimeout)
      .map(s => s && TreeListStatistics.fromObject(s))
      .subscribe((result: TreeListStatistics) => {
        successCallback(result);
      }, (e: any) => {
        TreeService.LOG.error('Could not load statistics: ' + e.message, e);
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

    TreeService.LOG.debug('Loading available trees from ' + this.envService.endpoints.allTrees + ' ...');

    this.http.get<Array<Tree>>(this.envService.endpoints.allTrees)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<Tree>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load trees: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Load the given tree's basic info.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadTree(treeId: number,
                  successCallback: (trees: Tree) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.tree(treeId);

    TreeService.LOG.debug('Loading tree ' + treeId + ' from ' + url + ' ...');

    this.http.get<Tree>(url)
      .timeout(this.envService.defaultTimeout)
      .map(r => r && Tree.fromObject(r))
      .subscribe((result: Tree) => {
        successCallback(result);
      }, (e: any) => {
        TreeService.LOG.error('Could not load tree with id ' + treeId + ': ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Load the given beacon's data.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadBeaconData(beaconId: number,
                  successCallback: (beaconDatasets: Array<BeaconData>) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.beaconData(beaconId);

    TreeService.LOG.debug('Loading beacon data for beacon id ' + beaconId + ' from ' + url + ' ...');

    this.http.get<Array<BeaconData>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(d => BeaconData.fromObject(d)))
      .subscribe((results: Array<BeaconData>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load beacon data with beacon id ' + beaconId + ': ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Loads all cities from the database.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadCities(successCallback: (cities: Array<string>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeService.LOG.debug('Loading cities from ' + this.envService.endpoints.cities + ' ...');

    this.http.get<Array<string>>(this.envService.endpoints.cities)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<string>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load cities: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

}
