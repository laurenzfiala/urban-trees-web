import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../shared/entities/api-error.entity';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {AuthService} from '../../shared/services/auth.service';
import {UserContent} from '../entities/user-content.entity';
import {UserContentMetadata} from '../entities/user-content-metadata.entity';
import {UserContentManagerAccess} from '../entities/user-content-manager-access.entity';
import {UserContentAccess} from '../entities/user-content-access.entity';
import {UserContentStatus} from '../entities/user-content-status.entity';
import {map} from 'rxjs/operators';

/**
 * Handles loading and approving of CMS content for the ContentManagerComponent.
 * @author Laurenz Fiala
 * @since 2022/03/20
 */
@Injectable({
  providedIn: 'root'
})
export class ContentManagerService extends AbstractService {

  private static LOG: Log = Log.newInstance(ContentManagerService);

  constructor(private authService: AuthService,
              private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load all content access entries that are viewable and APPROVED by the current user.
   * @param pathExp optionally restrict content access to this content path expression
   * @param successCallback on success with payload
   * @param errorCallback on error
   */
  public loadContentAccessViewable(pathExp: string,
                                   successCallback: (accessList: Array<UserContentManagerAccess>) => void,
                                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerContentAccessViewable(pathExp);
    ContentManagerService.LOG.debug('Loading approvable content access at ' + url + '...');
    this.http.get<Array<UserContentManagerAccess>>(url)
      .pipe(map(list => list && list.map(a => UserContentManagerAccess.fromObject(a, this.envService))))
      .subscribe((accessList: Array<UserContentManagerAccess>) => {
        ContentManagerService.LOG.debug('Loaded approvable content access at ' + url + ' successfully.');
        successCallback(accessList);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not load approvable content access at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all content access entries that are approvable by the current user.
   * @param pathExp optionally restrict content access to this content path expression
   * @param successCallback on success with payload
   * @param errorCallback on error
   */
  public loadContentAccessApprovable(pathExp: string,
                                     successCallback: (accessList: Array<UserContentManagerAccess>) => void,
                                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerContentAccessApprovable(pathExp);
    ContentManagerService.LOG.debug('Loading viewable content access at ' + url + '...');
    this.http.get<Array<UserContentManagerAccess>>(url)
      .pipe(map(list => list && list.map(a => UserContentManagerAccess.fromObject(a, this.envService))))
      .subscribe((accessList: Array<UserContentManagerAccess>) => {
        ContentManagerService.LOG.debug('Loaded viewable content access at ' + url + ' successfully.');
        successCallback(accessList);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not load viewable content access at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load published content that's viewable by the current user for the given UserContentAccess.
   * @param access load contents that are subject to this user_content_access entry
   * @param status may be undefined; if not, this restricts contents to that status
   * @param successCallback on success with payload
   * @param errorCallback on error
   */
  public loadContentViewable(access: UserContentAccess,
                             status: UserContentStatus,
                             successCallback: (contentList: Array<UserContentMetadata>) => void,
                             errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerContentViewable(access.id);
    ContentManagerService.LOG.debug('Loading viewable content at ' + url + '...');
    this.http.get<Array<UserContentManagerAccess>>(url)
      .pipe(map(list => list && list.map(a => UserContentMetadata.fromObject(a, this.envService))))
      .subscribe((contentList: Array<UserContentMetadata>) => {
        ContentManagerService.LOG.debug('Loaded viewable content at ' + url + ' successfully.');
        successCallback(contentList);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not load viewable content at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load content that's approvable by the current user for the given UserContentAccess.
   * @param access load contents that are subject to this user_content_access entry
   * @param status may be undefined; if not, this restricts contents to that status
   * @param successCallback on success with payload
   * @param errorCallback on error
   */
  public loadContentApprovable(access: UserContentAccess,
                               status: UserContentStatus,
                               successCallback: (contentList: Array<UserContentMetadata>) => void,
                               errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerContentApprovable(access.id);
    ContentManagerService.LOG.debug('Loading approvable content at ' + url + '...');
    this.http.get<Array<UserContentManagerAccess>>(url)
      .pipe(map(list => list && list.map(a => UserContentMetadata.fromObject(a, this.envService))))
      .subscribe((contentList: Array<UserContentMetadata>) => {
        ContentManagerService.LOG.debug('Loaded approvable content at ' + url + ' successfully.');
        successCallback(contentList);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not load approvable content at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * TODO
   * @param contentUid
   * @param successCallback
   * @param errorCallback
   */
  public loadContent(contentUid: number,
                     successCallback: (content: UserContent) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerContent(contentUid);
    ContentManagerService.LOG.debug('Loading approvable content at ' + url + '...');
    this.http.get<Array<UserContentManagerAccess>>(url)
      .pipe(map(c => UserContent.fromObject(c, this.envService)))
      .subscribe((content: UserContent) => {
        ContentManagerService.LOG.debug('Loaded content at ' + url + ' successfully.');
        successCallback(content);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not load content at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public approveContent(contentUid: number,
                        successCallback: (status: UserContentStatus) => void,
                        errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerApproveContent(contentUid);
    ContentManagerService.LOG.debug('Approving content at ' + url + '...');
    this.http.post<UserContentStatus>(url, {})
      .pipe(map(s => UserContentStatus[s]))
      .subscribe((status: UserContentStatus) => {
        ContentManagerService.LOG.debug('Approved content at ' + url + ' successfully.');
        successCallback(status);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not approve content at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public denyContent(contentUid: number,
                     successCallback: (status: UserContentStatus) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    let url = this.envService.endpoints.managerDenyContent(contentUid);
    ContentManagerService.LOG.debug('Denying content at ' + url + '...');
    this.http.post<UserContentStatus>(url, {})
      .pipe(map(s => UserContentStatus[s]))
      .subscribe((status: UserContentStatus) => {
        ContentManagerService.LOG.debug('Denying content at ' + url + ' successfully.');
        successCallback(status);
      }, (e: any) => {
        ContentManagerService.LOG.error('Could not deny content at ' + url + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
