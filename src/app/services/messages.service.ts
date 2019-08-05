import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {EnvironmentService} from './environment.service';
import {Log} from './log.service';
import 'rxjs/add/operator/map';
import {ApiError} from '../entities/api-error.entity';
import {Report} from '../entities/report.entity';
import {ReportFrontend} from '../entities/report-frontend.entity';

/**
 * Service for messages & reports.
 *
 * @author Laurenz Fiala
 * @since 2019/07/31
 */
@Injectable()
export class MessagesService extends AbstractService {

  private static LOG: Log = Log.newInstance(MessagesService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load all reports from the backend.
   */
  public loadReports(successCallback: (reports: Array<ReportFrontend>) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<Report>>(this.envService.endpoints.allReports)
      .map(list => list && list.map(r => ReportFrontend.fromObject(r)))
      .subscribe((reports: Array<ReportFrontend>) => {
        MessagesService.LOG.trace('Successfully loaded all reports.');
        successCallback(reports);
      }, (e: any) => {
        MessagesService.LOG.error('Could not load all reports: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Resolve a single report.
   */
  public updateReportRemark(report: Report,
                            successCallback: () => void,
                            errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.updateReportRemark(report.id), report.remark)
      .subscribe(() => {
        MessagesService.LOG.trace('Successfully updated remark for report ' + report.id + '.');
        successCallback();
      }, (e: any) => {
        MessagesService.LOG.trace('Could not update remark for report' + report.id + '.');
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Resolve a single report.
   */
  public resolveReport(report: Report,
                       successCallback: () => void,
                       errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.resolveReport(report.id), null)
      .subscribe(() => {
        MessagesService.LOG.trace('Successfully resolved report ' + report.id + '.');
        successCallback();
      }, (e: any) => {
        MessagesService.LOG.trace('Could not resolve report ' + report.id + '.');
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Unresolve a single report.
   */
  public unresolveReport(report: Report,
                         successCallback: () => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.unresolveReport(report.id), null)
      .subscribe(() => {
        MessagesService.LOG.trace('Successfully unresolved report ' + report.id + '.');
        successCallback();
      }, (e: any) => {
        MessagesService.LOG.trace('Could not unresolve report ' + report.id + '.');
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}

