import { Injectable } from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../../shared/services/abstract.service';
import {ApiError} from '../../shared/entities/api-error.entity';
import {SystemStatistics} from '../entities/system-statistics.entity';
import {MeasurementStatistics} from '../entities/measurement-statistics.entity';

/**
 * Service for UI functionality.
 *
 * @author Laurenz Fiala
 * @since 2019/07/14
 */
@Injectable()
export class UIService extends AbstractService {

  private static LOG: Log = Log.newInstance(UIService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Get stats from backend regarding system functionality.
   * @param successCallback
   * @param errorCallback
   */
  public loadSystemStatistics(successCallback: (stats: SystemStatistics) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get(this.envService.endpoints.systemStatistics)
      .map(s => s && SystemStatistics.fromObject(s))
      .subscribe((response: SystemStatistics) => {
        UIService.LOG.debug('Received system stats.');
        successCallback(response);
      }, (e: any) => {
        UIService.LOG.error('Could not get system stats: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Get stats from backend regarding measurement values etc.
   * @param successCallback
   * @param errorCallback
   */
  public loadMeasurementStatistics(successCallback: (stats: MeasurementStatistics) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get(this.envService.endpoints.measurementsStatistics)
      .map(s => s && MeasurementStatistics.fromObject(s))
      .subscribe((response: MeasurementStatistics) => {
        UIService.LOG.debug('Received measurement stats.');
        successCallback(response);
      }, (e: any) => {
        UIService.LOG.error('Could not get measurement stats: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
