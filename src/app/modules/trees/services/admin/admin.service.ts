import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {AbstractService} from '../../../shared/services/abstract.service';
import {Log} from '../../../shared/services/log.service';
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
import {UserCreation} from '../../entities/user-creation.entity';
import {SearchResult} from '../../entities/search-result.entity';
import {Observable} from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';

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
      .pipe(timeout(this.envService.defaultTimeout), map(c => City.fromObject(c)))
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
      .pipe(timeout(this.envService.defaultTimeout), map(t => Tree.fromObject(t)))
      .subscribe((result: Tree) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not save tree: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public addUsers(templateUser: User,
                 usernames: Array<string>,
                 successCallback: (createdUsers: Array<User>) => void,
                 errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    AdminService.LOG.debug('Saving users to ' + this.envService.endpoints.addUsers + ' ...');

    const payload = new UserCreation(templateUser, usernames);
    this.http.put<Array<User>>(this.envService.endpoints.addUsers, payload)
      .pipe(timeout(this.envService.defaultTimeout), map(r => r && r.map(u => User.fromObject(u))))
      .subscribe((createdUsers) => {
        successCallback(createdUsers);
      }, (e: any) => {
        AdminService.LOG.error('Could not save user: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public requestLoginKey(userId: number,
                         successCallback: (loginKey: string) => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    const url = this.envService.endpoints.loginKey(userId);
    AdminService.LOG.debug('Saving user to ' + url + ' ...');

    this.http.get(url, {responseType: 'text'})
      .pipe(timeout(this.envService.defaultTimeout))
      .subscribe((response: string) => {
        successCallback(response);
      }, (e: any) => {
        AdminService.LOG.error('Could not request login key: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public getLoginQrUrl(userId: number): string {
    return this.envService.endpoints.loginQr(userId);
  }

  public getBulkLoginQrUrl(transactionId: string): string {
    return this.envService.endpoints.bulkLoginQr(transactionId);
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
      .pipe(timeout(this.envService.defaultTimeout), map(t => Tree.fromObject(t)))
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
      .pipe(timeout(this.envService.defaultTimeout), map(b => b && BeaconFrontend.fromObject(b)))
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
      .pipe(timeout(this.envService.defaultTimeout), map(b => BeaconFrontend.fromObject(b)))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout), map(list => list && list.map(l => BeaconLog.fromObject(l))))
      .subscribe((result: Array<BeaconLog>) => {
        successCallback(result);
      }, (e: any) => {
        AdminService.LOG.error('Could not load beacon logs: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  public loadUsers(searchFilters: Map<string, any | any[]>,
                   limit: number,
                   offset: number): Observable<SearchResult<Array<User>>> {

    let url = this.envService.endpoints.loadUsers(limit, offset);
    AdminService.LOG.debug('Loading users...');

    return this.http.post<SearchResult<Array<User>>>(url, this.searchFiltersToPayload(searchFilters))
      .pipe(timeout(this.envService.defaultTimeout), map(r => {
        const result = SearchResult.fromObject(r);
        result.result = result.result.map(user => User.fromObject(user));
        return result;
      }), catchError(e => {
        AdminService.LOG.error('Could not load users: ' + e.message, e);
        throw this.safeApiError(e);
      }));

  }

  /**
   * Converts the given search filters map to an object.
   * It also converts all dates to string using the correct
   * output format.
   * @param searchFilters search filters to convert
   * @returns the object to pass to the HttpClient
   */
  private searchFiltersToPayload(searchFilters: Map<string, any | any[]>): any {

    return Array.from(searchFilters).reduce((obj, [key, value]) => {
      if (value instanceof Date) {
        obj[key] = moment(value).startOf('day').utc().format(this.envService.outputDateFormat);
      } else {
        obj[key] = value;
      }
      return obj;
    }, {});

  }

  public loadRoles(successCallback: (users: Array<Role>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.loadRole;
    AdminService.LOG.debug('Loading all user roles...');

    this.http.get<Array<User>>(url)
      .pipe(timeout(this.envService.defaultTimeout), map(list => list && list.map(r => Role.fromObject(r))))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
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
      .pipe(timeout(this.envService.defaultTimeout))
      .subscribe(() => {
        successCallback();
      }, (e: any) => {
        AdminService.LOG.error('Could not delete announcement: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public bulkAction(action: BulkAction,
                   transactionId: string,
                   data: any,
                   successCallback: (affectedUsers: Array<User>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let url = this.envService.endpoints.usersBulkAction(BulkAction[action], transactionId);
    AdminService.LOG.debug('Sending bulk action execution order for action ' + action + ' with tid ' + transactionId + '...');

    const payload = Object.assign({}, data);

    this.http.post<Array<User>>(url, payload)
      .pipe(timeout(this.envService.bulkTimeout), map(users => users && users.map(u => User.fromObject(u))))
      .subscribe((affectedUsers: Array<User>) => {
        successCallback(affectedUsers);
      }, (e: any) => {
        AdminService.LOG.error('Could not execute bulk action: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}

export enum BulkAction {

  EXPIRE_CREDENTIALS,
  CREATE_LOGIN_LINKS,
  CREATE_LOGIN_LINKS_PERMANENT,
  ADD_ROLES,
  REMOVE_ROLES,
  ACTIVATE,
  INACTIVATE,
  DELETE

}
