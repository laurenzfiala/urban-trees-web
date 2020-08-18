import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Tree} from '../entities/tree.entity';
import {ApiError} from '../../shared/entities/api-error.entity';
import {EnvironmentService} from '../../shared/services/environment.service';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from '../../shared/services/log.service';
import {BeaconData} from '../entities/beacon-data.entity';
import * as moment from 'moment';
import {City} from '../entities/city.entity';
import {TreeSpecies} from '../entities/tree-species.entity';
import {BeaconSettings} from '../entities/beacon-settings.entity';
import {BeaconDataMode} from '../entities/beacon-data-mode.entity';
import {BeaconFrontend} from '../entities/beacon-frontend.entity';
import {Beacon} from '../entities/beacon.entity';

/**
 * Service for backend calls regarding beacons
 *
 * @author Laurenz Fiala
 * @since 2019/07/16
 */
@Injectable()
export class BeaconService extends AbstractService {

  private static LOG: Log = Log.newInstance(BeaconService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load a single Beacon.
   * @param {(trees: Array<BeaconFrontend>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadBeacon(beaconId: number,
                    successCallback: (beaconDatasets: BeaconFrontend) => void,
                    errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.loadBeacon(beaconId);
    BeaconService.LOG.debug('Loading beacon ' + beaconId + ' from ' + url + ' ...');

    this.http.get<BeaconFrontend>(url)
      .timeout(this.envService.defaultTimeout)
      .map(b => BeaconFrontend.fromObject(b))
      .subscribe((result: BeaconFrontend) => {
        successCallback(result);
      }, (e: any) => {
        BeaconService.LOG.error('Could not load beacon: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all available Beacons.
   * @param {(trees: Array<BeaconFrontend>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadBeacons(successCallback: (beaconDatasets: Array<BeaconFrontend>) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.loadBeacons;
    BeaconService.LOG.debug('Loading beacons from ' + url + ' ...');

    this.http.get<Array<BeaconFrontend>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(b => BeaconFrontend.fromObject(b)))
      .subscribe((results: Array<BeaconFrontend>) => {
        successCallback(results);
      }, (e: any) => {
        BeaconService.LOG.error('Could not load beacons: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
