import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../../entities/user.entity';
import {AdminService} from '../../../services/admin/admin.service';
import {AbstractComponent} from '../../abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../../shared/entities/api-error.entity';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Role} from '../../../entities/role.entity';
import {EnvironmentService} from '../../../../shared/services/environment.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ut-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class AdminUserComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private newUserModalRef: BsModalRef;
  public addUserMultiple: boolean = false;
  public newUser: User;
  public newUserUsernames: Array<string> = new Array<string>();
  public newUserRoles: Array<Role>;

  /**
   * Current user search input.
   */
  public searchInput: string;

  /**
   * All users currently displayed.
   */
  public displayUsers: Array<User>;

  /**
   * Holds all registered users.
   */
  public availableUsers: Array<User>;

  /**
   * Holds all available user roles.
   */
  public availableRoles: Array<Role>;

  /**
   * Once loaded, contains the secure
   * login link of the selected user.
   */
  public secureLoginLink: string = 'test';

  @ViewChild('secureLoginLinkTextfield')
  public secureLoginLinkTextfield: ElementRef;

  constructor(private adminService: AdminService,
              private modalService: BsModalService,
              private envService: EnvironmentService,
              private sanitizer: DomSanitizer) {
    super();
  }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
  }

  public loadUsers(): void {

    this.setStatus(StatusKey.USERS, StatusValue.IN_PROGRESS);
    this.adminService.loadUsers((users: Array<User>) => {
      this.availableUsers = users;
      this.setSearchInput(null);
      this.setStatus(StatusKey.USERS, StatusValue.SUCCESSFUL);
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.USERS, StatusValue.FAILED);
    });

  }

  public loadRoles(): void {

    this.setStatus(StatusKey.ROLES, StatusValue.IN_PROGRESS);
    this.adminService.loadRoles((roles: Array<Role>) => {
      this.availableRoles = roles;
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
      const csvPayload = users.map(u => u.username + ',' + this.envService.endpoints.loginKeyUrl(u.secureLoginKey)).join('\n');
      const csvBlob = new Blob([csvPayload], { type: 'text/csv' });
      const csvURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(csvBlob));
      this.setStatus(StatusKey.NEW_USER, StatusValue.SUCCESSFUL, csvURL);
      // TODO update users
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_USER, StatusValue.FAILED, apiError);
    });

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
   * Set user search and filter displayed users by input.
   * @param {string} searchInput user's search input
   */
  public setSearchInput(searchInput: string): void {

    if (!searchInput) {
      this.displayUsers = this.availableUsers;
      return;
    }

    this.displayUsers = this.availableUsers.filter((user: User) => {
      return user.id === Number.parseInt(searchInput, 10) || user.username.indexOf(searchInput) !== -1;
    });

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
  MODIFY_ROLE

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
