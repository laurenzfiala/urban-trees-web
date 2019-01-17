import { Injectable } from '@angular/core';
import {Log} from './log.service';
import {EnvironmentService} from './environment.service';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {ApiError} from '../entities/api-error.entity';
import {UserAchievements} from '../entities/user-achievement.entity';

/**
 * Service for user functionality.
 *
 * @author Laurenz Fiala
 * @since 2019/01/15
 */
@Injectable()
export class UserService extends AbstractService {

  private static LOG: Log = Log.newInstance(UserService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * TODO
   * @param successCallback
   * @param errorCallback
   */
  public loadAchievements(successCallback: (achievements: UserAchievements) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get(this.envService.endpoints.userAchievements)
      .map(a => a && UserAchievements.fromObject(a))
      .subscribe((response: UserAchievements) => {
        UserService.LOG.debug('Received user achievements.');
        successCallback(response);
      }, (e: any) => {
        UserService.LOG.error('Could not get user achievements: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
