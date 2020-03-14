import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AbstractService} from '../../../shared/services/abstract.service';
import {Log} from '../log.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {Tree} from '../../entities/tree.entity';
import {ApiError} from '../../../shared/entities/api-error.entity';
import {City} from '../../entities/city.entity';
import {Beacon} from '../../entities/beacon.entity';
import {User} from '../../entities/user.entity';
import {Role} from '../../entities/role.entity';
import {Announcement} from '../../entities/announcement.entity';
import * as moment from 'moment';
import {BeaconLog} from '../../entities/beacon-log.entity';
import {BeaconLogSeverity} from '../../entities/BeaconLogSeverity';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';

/**
 * Service for backend calls on the admin pages.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
@Injectable()
export class AdminService extends AbstractService {

  private static LOG: Log = Log.newInstance(AdminService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Submit new city to the backend.
   * @param tree the new city to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addCity(city: City,
                  successCallback: (city: City) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving new city to ' + this.envService.endpoints.addCity + ' ...');

    this.http.post(this.envService.endpoints.addCity, city)
      .timeout(this.envService.defaultTimeout)
      .map(c => City.fromObject(c))
      .subscribe((result: City) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save city: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new tree to the backend.
   * @param tree the tree to be submitted
   * @param successCallback called upon successful execution with updated tree
   * @param errorCallback called upon error
   */
  public addTree(tree: Tree,
                  successCallback: (result: Tree) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving tree to ' + this.envService.endpoints.addTree + ' ...');

    this.http.post(this.envService.endpoints.addTree, tree)
      .timeout(this.envService.defaultTimeout)
      .map(t => Tree.fromObject(t))
      .subscribe((result: Tree) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public addUser(user: User,
                 successCallback: () => void,
                 errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving user to ' + this.envService.endpoints.addUser + ' ...');

    this.http.put(this.envService.endpoints.addUser, user)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not save user: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public requestLoginKey(userId: number,
                         successCallback: (loginKey: string) => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving user to ' + this.envService.endpoints.addUser + ' ...');

    this.http.get(this.envService.endpoints.loginKey(userId), {responseType: 'text'})
      .timeout(this.envService.defaultTimeout)
      .subscribe((response: string) => {
        successCallback(response);
      }, (e: any) => {
        AdminService.LOG.error('Could not request login key: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit modified tree to the backend.
   * @param tree the tree to be submitted
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public modifyTree(tree: Tree,
                  successCallback: (result: Tree) => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving tree (modified) to ' + this.envService.endpoints.addTree + ' ...');

    this.http.post(this.envService.endpoints.modifyTree(tree.id), tree)
      .timeout(this.envService.defaultTimeout)
      .map(t => Tree.fromObject(t))
      .subscribe((result: Tree) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree (modified): ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new beacon to the backend.
   * @param beacon The beacon to insert.
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public addBeacon(beacon: Beacon,
                   successCallback: (result: BeaconFrontend) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving beacon to ' + this.envService.endpoints.addBeacon + ' ...');

    this.http.post(this.envService.endpoints.addBeacon, beacon)
      .timeout(this.envService.defaultTimeout)
      .map(b => b && BeaconFrontend.fromObject(b))
      .subscribe((result: BeaconFrontend) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save beacon: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Submit new beacon to the backend.
   * @param beacon The beacon to insert.
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public modifyBeacon(beacon: Beacon,
                      successCallback: (result: BeaconFrontend) => void,
                      errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.modifyBeacon(beacon.id);
    AdminService.LOG.debug('Saving beacon (modified) to ' + url + ' ...');

    this.http.post(url, beacon)
      .timeout(this.envService.defaultTimeout)
      .map(b => BeaconFrontend.fromObject(b))
      .subscribe((result: BeaconFrontend) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save beacon (modified): ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Delete beacon from the backend.
   * @param beacon The id of the beacon to delete
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public deleteBeacon(beaconId: number,
                      successCallback: () => void,
                      errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.deleteBeacon(beaconId);
    AdminService.LOG.debug('Deleting beacon - ' +  + ' ...');

    this.http.delete(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete beacon: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Delete beacon from the backend.
   * @param beacon The id of the beacon to delete
   * @param minSeverity Minimum log severity to show
   * @param successCallback called upon successful execution
   * @param errorCallback called upon error
   */
  public loadBeaconLogs(beaconId: number,
                      minSeverity: BeaconLogSeverity,
                      offset: number,
                      maxLogs: number,
                      successCallback: (result: Array<BeaconLog>) => void,
                      errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.loadBeaconLogs(beaconId, minSeverity, offset, maxLogs);
    AdminService.LOG.debug('Loading beacon logs...');

    this.http.get<Array<BeaconLog>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(l => BeaconLog.fromObject(l)))
      .subscribe((result: Array<BeaconLog>) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not load beacon logs: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public loadUsers(successCallback: (users: Array<User>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.loadUsers;
    AdminService.LOG.debug('Loading users...');

    this.http.get<Array<User>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(u => User.fromObject(u)))
      .subscribe((result: Array<User>) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not load users: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public loadRoles(successCallback: (users: Array<Role>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.loadRole;
    AdminService.LOG.debug('Loading all user roles...');

    this.http.get<Array<User>>(url)
      .timeout(this.envService.defaultTimeout)
      .map(list => list && list.map(r => Role.fromObject(r)))
      .subscribe((result: Array<Role>) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not load all user roles: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public addRoles(userId: number,
                 roles: Array<Role>,
                 successCallback: () => void,
                 errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.addRoles(userId);
    AdminService.LOG.debug('Adding user roles...');

    this.http.put(url, roles)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not add roles to user: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public removeRoles(userId: number,
                     roles: Array<Role>,
                     successCallback: () => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.removeRoles(userId);
    AdminService.LOG.debug('Adding user role...');

    this.http.put(url, roles)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete roles from user: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public deleteUser(user: User,
                    successCallback: () => void,
                    errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.deleteUser(user.id);
    AdminService.LOG.debug('Deleting user ' + user.username + '...');

    this.http.delete(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete user: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public expireCredentials(user: User,
                           successCallback: () => void,
                           errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.expireCredentials(user.id);
    AdminService.LOG.debug('Expiring credentials of user ' + user.username + '...');

    this.http.get(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not expire credentials: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public activate(user: User,
                  successCallback: () => void,
                  errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.activate(user.id);
    AdminService.LOG.debug('Activating user ' + user.username + '...');

    this.http.get(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not activate user: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public inactivate(user: User,
                    successCallback: () => void,
                    errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.inactivate(user.id);
    AdminService.LOG.debug('Inactivating user ' + user.username + '...');

    this.http.get(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not inactivate user: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public addAnnouncement(announcement: Announcement,
                         successCallback: () => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.addAnnouncement;
    AdminService.LOG.debug('Adding announcement with title ' + announcement.title + '...');

    let payload = JSON.stringify(announcement, (k, v) => {

      if (announcement[k] instanceof Date) {
        return moment.utc(announcement[k]).format(this.envService.outputDateFormat);
      }

      return v;

    });

    this.http.put(url, payload, {headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })})
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not add announcement: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public deleteAnnouncement(announcmentId: number,
                            successCallback: () => void,
                            errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.deleteAnnouncement(announcmentId);
    AdminService.LOG.debug('Deleting announcement with id ' + announcmentId + '...');

    this.http.delete(url)
      .timeout(this.envService.defaultTimeout)
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete announcement: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
