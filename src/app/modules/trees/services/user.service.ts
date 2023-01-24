import {Injectable, OnDestroy} from '@angular/core';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../../shared/services/abstract.service';
import {ApiError} from '../../shared/entities/api-error.entity';
import {UserAchievements} from '../entities/user-achievement.entity';
import {UserData} from '../entities/user-data.entity';
import {interval} from 'rxjs';
import {SubscriptionManagerService} from './subscription-manager.service';
import {AuthService} from '../../shared/services/auth.service';
import {Report} from '../entities/report.entity';
import {map, timeout} from 'rxjs/operators';

/**
 * Service for user functionality.
 *
 * @author Laurenz Fiala
 * @since 2019/01/15
 */
@Injectable()
export class UserService extends AbstractService implements OnDestroy {

  private static SUBSCRIPTION_TAG = 'user-svc';

  private static LOG: Log = Log.newInstance(UserService);

  private cachedUserData!: UserData;
  private loadingUserData: boolean = false;

  constructor(private http: HttpClient,
              private envService: EnvironmentService,
              private subs: SubscriptionManagerService,
              private authService: AuthService) {
    super();
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(UserService.SUBSCRIPTION_TAG);
  }

  /**
   * Load current achievement data for the logged-in user.
   * @param successCallback
   * @param errorCallback
   */
  public loadAchievements(successCallback: (achievements: UserAchievements) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get(this.envService.endpoints.userAchievements)
      .pipe(timeout(this.envService.defaultTimeout), map(a => a && UserAchievements.fromObject(a)))
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

  /**
   * Fetch user data.
   * @param successCallback
   * @param errorCallback
   */
  public loadUserData(successCallback: (userdata: UserData) => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get(this.envService.endpoints.userData)
      .pipe(timeout(this.envService.defaultTimeout), map(a => a && UserData.fromObject(a)))
      .subscribe((response: UserData) => {
        UserService.LOG.debug('Received user data.');
        successCallback(response);
      }, (e: any) => {
        UserService.LOG.error('Could not get user data: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Returns undefined as long as user data has not
   * successfully been retrieved from backend.
   * Then the cached result is returned immediately
   * from that point onwards.
   */
  public getUserData(): UserData {
    if (!this.authService.isAdmin()) {
      return undefined;
    }
    if (!this.cachedUserData && !this.loadingUserData) {
      this.loadingUserData = true;
      this.loadUserData(userdata => {
        this.cachedUserData = userdata;
        this.loadingUserData = false;
        this.startUserDataRefresh();
      });
    }
    return this.cachedUserData;
  }

  /**
   * Starts interval scheduled refresh of user data.
   */
  private startUserDataRefresh(): void {

    this.authService.onStateChanged().subscribe(value => {
      if (this.authService.isUserAnonymous() || this.authService.isTempChangePasswordAuth()) {
        this.cachedUserData = undefined;
        this.subs.unsubscribe(UserService.SUBSCRIPTION_TAG);
      }
    });

    this.subs.register(interval(this.envService.userDataRefreshIntervalMs)
      .subscribe(i => {
        UserService.LOG.trace('Updating user data...');
        this.loadUserData(userdata => {
          this.cachedUserData = userdata;
        });
      }), UserService.SUBSCRIPTION_TAG);

  }

  /**
   * TODO
   * @param successCallback
   * @param errorCallback
   */
  public deleteUser(successCallback: () => void,
              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.delete(this.envService.endpoints.userDeleteAccount)
      .pipe(timeout(this.envService.defaultTimeout))
      .subscribe(() => {
        UserService.LOG.info('Successfully deleted user account.');
        successCallback();
      }, (e: any) => {
        UserService.LOG.error('Could not delete user account: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all reports of the current user.
   * Only returns reports that are ither unresolved or (resolved and modified in the past 3 months).
   */
  public loadReports(successCallback: (results: Array<Report>) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<Report>>(this.envService.endpoints.userReport)
      .pipe(timeout(this.envService.defaultTimeout), map(list => list && list.map(r => Report.fromObject(r, this.envService))))
      .subscribe((results: Array<Report>) => {
        UserService.LOG.debug('Successfully loaded user reports.');
        successCallback(results);
      }, (e: any) => {
        UserService.LOG.error('Could not load user reports: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Send a single user-report.
   * @param report report to send
   */
  public sendReport(report: Report,
                    successCallback: () => void,
                    errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.put(this.envService.endpoints.userReport, report)
      .pipe(timeout(this.envService.defaultTimeout))
      .subscribe(() => {
        UserService.LOG.info('Successfully sent report.');
        successCallback();
      }, (e: any) => {
        UserService.LOG.error('Could not send user report: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
