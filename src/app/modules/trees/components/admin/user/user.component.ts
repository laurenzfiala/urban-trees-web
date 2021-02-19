import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../../entities/user.entity';
import {AdminService, BulkAction} from '../../../services/admin/admin.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../../shared/entities/api-error.entity';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Role} from '../../../entities/role.entity';
import {EnvironmentService} from '../../../../shared/services/environment.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SearchResult} from '../../../entities/search-result.entity';
import {TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from '../../../../shared/components/abstract.component';

@Component({
  selector: 'ut-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class AdminUserComponent extends AbstractComponent implements OnInit {

  private static SEARCH_PAGE_SIZE = 50;
  private static MAX_SEARCH_RESULTS = 10000;

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public BulkAction = BulkAction;

  public addUserMultiple: boolean = false;
  public newUser: User;
  public newUserUsernames: Array<string> = new Array<string>();
  public newUserRoles: Array<Role>;

  public searchFilters: Map<string, any | any[]> = new Map<string, any | any[]>();
  private _searchFilterRoles: Array<Role>;
  private searchDebounceTimeoutId: number;

  public showFilters: boolean;
  public showActions: boolean;

  private newUserModalRef: BsModalRef;
  private bulkActionModalRef: BsModalRef;

  /**
   * Holds search result received from backend.
   */
  public searchResult: SearchResult<Array<User>>;

  /**
   * Holds all available user roles.
   */
  public availableRoles: Array<Role>;

  /**
   * The currently selected bulk action to execute.
   */
  public bulkAction: BulkAction;

  @ViewChild('secureLoginLinkTextfield')
  public secureLoginLinkTextfield: ElementRef;

  @ViewChild('bulkActionModal')
  public bulkActionModal: TemplateRef<any>;

  constructor(private adminService: AdminService,
              private modalService: BsModalService,
              public envService: EnvironmentService,
              private translateService: TranslateService,
              private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.showFilters = false;
    this.showActions = false;

    this.loadUsers();
    this.loadRoles();
  }

  public loadUsers(loadAll: boolean = false): void {

    let limit, offset;
    if (loadAll) {
      limit = AdminUserComponent.MAX_SEARCH_RESULTS - this.searchResult.result.length;
      offset = this.searchResult.result.length;
    } else {
      limit = AdminUserComponent.SEARCH_PAGE_SIZE;
      offset = 0;
    }

    this.setStatus(StatusKey.USERS, StatusValue.IN_PROGRESS);
    this.adminService.loadUsers(this.searchFilters, limit, offset, (result: SearchResult<Array<User>>) => {
      if (loadAll) {
        this.searchResult.result.push(...result.result);
      } else {
        this.searchResult = result;
      }
      this.setStatus(StatusKey.USERS, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.USERS, StatusValue.FAILED);
    });

  }

  public loadRoles(): void {

    this.setStatus(StatusKey.ROLES, StatusValue.IN_PROGRESS);
    this.adminService.loadRoles((roles: Array<Role>) => {
      this.availableRoles = roles;
      this._searchFilterRoles = roles.map(r => Role.fromObject(r));
      this.setStatus(StatusKey.ROLES, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.ROLES, StatusValue.FAILED);
    });

  }

  public deleteUser(user: User) {

    user.deleteStatus = StatusValue.IN_PROGRESS;
    this.adminService.deleteUser(user, () => {
      user.deleteStatus = StatusValue.SUCCESSFUL;
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      user.deleteStatus = StatusValue.FAILED;
    });

  }

  public expireCredentials(user: User) {

    this.setStatus(StatusKey.EXPIRE_CREDENTIALS, StatusValue.IN_PROGRESS);
    this.adminService.expireCredentials(user, () => {
      user.credentialsNonExpired = false;
      this.setStatus(StatusKey.EXPIRE_CREDENTIALS, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.EXPIRE_CREDENTIALS, StatusValue.FAILED);
    });

  }

  public activate(user: User) {

    this.setStatus(StatusKey.ACTIVATE, StatusValue.IN_PROGRESS);
    this.adminService.activate(user, () => {
      user.active = true;
      this.setStatus(StatusKey.ACTIVATE, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.ACTIVATE, StatusValue.FAILED);
    });

  }

  public inactivate(user: User) {

    this.setStatus(StatusKey.INACTIVATE, StatusValue.IN_PROGRESS);
    this.adminService.inactivate(user, () => {
      user.active = false;
      this.setStatus(StatusKey.INACTIVATE, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.INACTIVATE, StatusValue.FAILED);
    });

  }

  public showNewUserModal(modalTemplateRef: TemplateRef<any>): void {
    this.newUser = new User();
    this.newUserRoles = this.availableRoles.map(r => r);
    this.newUserModalRef = this.modalService.show(modalTemplateRef);
  }

  public hideNewUserModal(): void {
    this.newUserModalRef.hide();
  }

  public addUsers(): void {

    this.newUser.roles = this.newUserRoles.filter(r => r.checked);
    const usernames = this.newUserUsernames.slice();

    this.setStatus(StatusKey.NEW_USER, StatusValue.IN_PROGRESS);
    this.adminService.addUsers(this.newUser, usernames, (users: Array<User>) => {
      this.setStatus(StatusKey.NEW_USER, StatusValue.SUCCESSFUL, this.generateUserLoginCsv(users));
      this.loadUsers();
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_USER, StatusValue.FAILED, apiError);
    });

  }

  /**
   * Generate a local CSV from the given users
   * and return the URL.
   * Only the username and login link are added to the CSV.
   * @param users list of users with populated login key
   * @private
   */
  private generateUserLoginCsv(users: Array<User>): SafeUrl {

    const csvPayload = users.map(u => {
      if (u.secureLoginKey) {
        return u.username + ',' + this.envService.endpoints.loginKeyUrl(u.secureLoginKey);
      } else {
        return '<ERROR>';
      }
    }).join('\n');
    const csvBlob = new Blob([csvPayload], { type: 'text/csv' });
    return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(csvBlob));

  }

  /**
   * Check if the given usernames are syntactically valid or not.
   * This does not check for e.g. existing usernames.
   * @param usernames usernames to check
   * @returns false if any of the usernames fail; true otherwise
   */
  private isUsernamesValid(...usernames: Array<string>): boolean {

    for (let username of usernames) {
      if (!username || /\s/g.test(username) || username.length < this.envService.security.minUsernameLength) {
        return false;
      }
    }
    return true;

  }

  public isNewUserUsernamesValid(): boolean {
    return this.newUserUsernames.length > 0 && this.isUsernamesValid(...this.newUserUsernames);
  }

  /**
   * Request a secure login link for the given user.
   */
  public requestSecureLink(user: User): void {

    this.setStatus(StatusKey.LOGIN_LINK, StatusValue.IN_PROGRESS);
    this.adminService.requestLoginKey(user.id, (token: string) => {
      this.setStatus(StatusKey.LOGIN_LINK, StatusValue.SUCCESSFUL);
      user.secureLoginKey = token;
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.LOGIN_LINK, StatusValue.FAILED);
    });

  }

  /**
   * Select the secure login link and copy it to the clipboard.
   */
  public copySecureLink(user: User): void {

    this.secureLoginLinkTextfield.nativeElement.select();
    document.execCommand('copy');

  }

  /**
   * Add or remove role of a user.
   * If the role is already assigned to the user, remove it.
   * If the role isn't already assigned to the user, add it.
   */
  public modifyRole(user: User, toggleRole: Role): void {

    let isAdd = !user.roles.some(r => toggleRole.id === r.id);

    this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.IN_PROGRESS);

    if (isAdd) {
      this.adminService.addRoles(user.id, [toggleRole], () => {
        this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.SUCCESSFUL);
        let r = user.roles.slice(0);
        r.push(toggleRole);
        user.roles = r;
      }, (error: HttpErrorResponse, apiError: ApiError) => {
        this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.FAILED);
      });
    } else {
      this.adminService.removeRoles(user.id, [toggleRole], () => {
        this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.SUCCESSFUL);
        user.roles = user.roles.filter(r => toggleRole.id !== r.id);
      }, (error: HttpErrorResponse, apiError: ApiError) => {
        this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.FAILED);
      });
    }

  }

  /**
   * Whether the given origRoles contains the given role findRole.
   */
  public containsRole(origRoles: Array<Role>, findRole: Role): boolean {
    return origRoles.some(r => r.id === findRole.id);
  }

  public setNewUserUsernamesString(usernames: string) {
    this.newUserUsernames = usernames.replace(/\r/g, '').split('\n');
  }

  public getNewUserUsernamesString(): string {
    return this.newUserUsernames ? this.newUserUsernames.join('\n') : '';
  }

  public getSearchFilter(key: string): any | any[] {
    return this.searchFilters.get(key);
  }

  public setSearchFilter(key: string, value: any | any[]) {

    this.setStatus(StatusKey.USERS, StatusValue.IN_PROGRESS);
    if (value === null || value === undefined || (value instanceof Array && value.length === 0)) {
      this.searchFilters.delete(key);
    } else {
      this.searchFilters.set(key, value);
    }

    if (this.searchDebounceTimeoutId) {
      window.clearTimeout(this.searchDebounceTimeoutId);
    }
    this.searchDebounceTimeoutId = window.setTimeout(() => {
      this.loadUsers();
    }, this.envService.searchDebounceApiMs);

  }

  public setSearchFilterNumericArray(key: string, value: string) {
    if (!value) {
      this.setSearchFilter(key, null);
      return;
    }
    const v = Number.parseInt(value, 10);
    this.setSearchFilter(key, [v]);
  }

  get searchFilterRoles(): Array<Role> {
    return this._searchFilterRoles;
  }

  public rolesForSearchFilter(): Array<number> {
    return this._searchFilterRoles.filter(r => r.checked).map(r => r.id);
  }

  public toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (this.showFilters) {
      this.showActions = false;
    }
  }

  public toggleActions(): void {
    this.showActions = !this.showActions;
    if (this.showActions) {
      this.showFilters = false;
    }
  }

  public confirmBulkAction(action: BulkAction): void {

    this.bulkAction = action;
    this.bulkActionModalRef = this.modalService.show(this.bulkActionModal, {ignoreBackdropClick: true});

  }

  public hideBulkActionModal(): void {
    this.bulkActionModalRef.hide();
    this.deleteStatus(StatusKey.BULK_ACTION);
  }

  public executeBulkAction(): void {

    this.setStatus(StatusKey.BULK_ACTION, StatusValue.IN_PROGRESS);
    this.unloadNotice();

    const action = this.bulkAction;
    this.adminService.bulkAction(this.searchFilters, action, (affectedUsers: Array<User>) => {
      let context;
      if (action === BulkAction.CREATE_LOGIN_LINKS) {
        const affectedUserIds = affectedUsers.map(au => au.id);
        let affectedUserIdsFilter = new Map<string, number[]>();
        affectedUserIdsFilter.set('id', affectedUserIds);
        this.adminService.loadUsers(affectedUserIdsFilter, null, null,
          result => {
            context = this.generateUserLoginCsv(result.result);
            this.setStatus(StatusKey.BULK_ACTION, StatusValue.SUCCESSFUL, context);
            this.unloadNotice(true);
            this.loadUsers();
          }, (error, apiError) => {
            this.setStatus(StatusKey.BULK_ACTION, StatusValue.FAILED, apiError);
            this.unloadNotice(true);
          });
      } else {
        this.unloadNotice(true);
        this.setStatus(StatusKey.BULK_ACTION, StatusValue.SUCCESSFUL, context);
        this.loadUsers();
      }
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.BULK_ACTION, StatusValue.FAILED, apiError);
      this.unloadNotice(true);
    });

  }

  private unloadNotice(deactivate: boolean = false) {

    if (deactivate) {
      window.onbeforeunload = null;
    } else {
      window.onbeforeunload = (e) => {
        e.preventDefault();
        e.returnValue = '';
        this.setStatus(StatusKey.BULK_ACTION_CLOSE_INFO, StatusValue.SHOW);
      };
    }

  }

}

export enum StatusKey {

  USERS,
  DELETE_USER,
  EXPIRE_CREDENTIALS,
  ACTIVATE,
  INACTIVATE,
  NEW_USER,
  ROLES,
  LOGIN_LINK,
  MODIFY_ROLE,
  BULK_ACTION,
  BULK_ACTION_CLOSE_INFO

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED,
  SHOW

}
