import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Tree} from '../entities/tree.entity';
import {ApiError} from '../../shared/entities/api-error.entity';
import {EnvironmentService} from '../../shared/services/environment.service';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from './log.service';
import {BeaconData} from '../entities/beacon-data.entity';
import * as moment from 'moment';
import {City} from '../entities/city.entity';
import {TreeSpecies} from '../entities/tree-species.entity';
import {BeaconSettings} from '../entities/beacon-settings.entity';
import {BeaconDataMode} from '../entities/beacon-data-mode.entity';

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
  public loadTrees(successCallback: (trees: Array<Tree>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeService.LOG.debug('Loading available trees from ' + this.envService.endpoints.allTrees + ' ...');

    this.http.get<Array<Tree>>(this.envService.endpoints.allTrees)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(d => Tree.fromObject(d)))
      .subscribe((results: Array<Tree>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load trees: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
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
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load the given beacon's data.
   * @param beaconId id of beaocn to load data for
   * @param maxDatapoints maximum datapoints to receive
   * @param mode mode of request
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadBeaconData(beaconId: number,
                  maxDatapoints: number,
                  mode: BeaconDataMode,
                  successCallback: (beaconDatasets: Array<BeaconData>) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let rangeStart;
    switch (mode) {
      case BeaconDataMode.LAST_24H:
        rangeStart = moment().utc().add(-24, 'hours').format(this.envService.outputDateFormat);
        break;
      case BeaconDataMode.LAST_WEEK:
        rangeStart = moment().utc().add(-1, 'week').format(this.envService.outputDateFormat);
        break;
      case BeaconDataMode.TEMP_LAST_MONTH_PER_DAY:
      case BeaconDataMode.HUMI_LAST_MONTH_PER_DAY:
        rangeStart = moment().utc().add(-1, 'month').format(this.envService.outputDateFormat);
        break;
    }

    const url = this.envService.endpoints.beaconData(beaconId, maxDatapoints, rangeStart);

    TreeService.LOG.debug('Loading beacon data for beacon id ' + beaconId + ' from ' + url + ' ...');

    this.http.get<Array<BeaconData>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(d => BeaconData.fromObject(d)))
      .subscribe((results: Array<BeaconData>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load beacon data with beacon id ' + beaconId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load the given beacon's settings.
   * @param beaconId id of beaocn to load data for
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadBeaconSettings(beaconId: number,
                  successCallback: (beaconSettings: BeaconSettings) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.beaconSettings(beaconId);

    TreeService.LOG.debug('Loading beacon settings for beacon id ' + beaconId + ' from ' + url + ' ...');

    this.http.get<BeaconSettings>(url)
      .timeout(this.envService.defaultTimeout)
      .map(s => BeaconSettings.fromObject(s))
      .subscribe((results: BeaconSettings) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load beacon settings with beacon id ' + beaconId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Loads all cities from the backend.
   * @param {(trees: Array<City>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadCities(successCallback: (cities: Array<City>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeService.LOG.debug('Loading cities from ' + this.envService.endpoints.cities + ' ...');

    this.http.get<Array<City>>(this.envService.endpoints.cities)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<City>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load cities: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Loads all species from the backend.
   * @param {(trees: Array<TreeSpecies>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadSpecies(successCallback: (cities: Array<TreeSpecies>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    TreeService.LOG.debug('Loading species from ' + this.envService.endpoints.species + ' ...');

    this.http.get<Array<TreeSpecies>>(this.envService.endpoints.species)
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<TreeSpecies>) => {
        successCallback(results);
      }, (e: any) => {
        TreeService.LOG.error('Could not load species: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
