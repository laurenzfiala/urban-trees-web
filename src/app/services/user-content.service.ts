import { Injectable } from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from './environment.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {ApiError} from '../entities/api-error.entity';
import {UserContent} from '../entities/user-content.entity';

/**
 * Service for user functionality.
 *
 * @author Laurenz Fiala
 * @since 2019/03/15
 */
@Injectable()
export class UserContentService extends AbstractService {

  private static LOG: Log = Log.newInstance(UserContentService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * TODO
   * @param successCallback
   * @param errorCallback
   */
  public loadContentByTag(contentTag: string,
              successCallback: (contentList: Array<UserContent>) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<UserContent>>(this.envService.endpoints.userContentByTag(contentTag))
      .map(list => list && list.map(a => UserContent.fromObject(a)))
      .subscribe((response: Array<UserContent>) => {
        UserContentService.LOG.debug('Received user content by tag ' + contentTag + '.');
        successCallback(response);
      }, (e: any) => {
        UserContentService.LOG.error('Could not get user content by tag ' + contentTag + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
