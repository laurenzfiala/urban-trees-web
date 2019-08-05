import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {User} from '../../../entities/user.entity';
import {AdminService} from '../../../services/admin/admin.service';
import {AbstractComponent} from '../../abstract.component';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../entities/api-error.entity';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Role} from '../../../entities/role.entity';
import {EnvironmentService} from '../../../services/environment.service';

@Component({
  selector: 'ut-admin-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class AdminUserComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private newUserModalRef: BsModalRef;
  private newUser: User;
  private newUserRoles: Array<Role>;

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

  @ViewChild('secureLoginLinkTextfield', { static: false })
  public secureLoginLinkTextfield: ElementRef;

  constructor(private adminService: AdminService,
              private modalService: BsModalService,
              private envService: EnvironmentService) {
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

  public addUser(): void {

    this.newUser.roles = this.newUserRoles.filter(r => r.checked);

    this.setStatus(StatusKey.NEW_USER, StatusValue.IN_PROGRESS);
    this.adminService.addUser(this.newUser, () => {
      this.setStatus(StatusKey.NEW_USER, StatusValue.SUCCESSFUL);
      this.loadUsers();
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_USER, StatusValue.FAILED);
    });

  }

  public isNewUserUsernameValid(): boolean {
    return this.newUser.username && this.newUser.username.length >= this.envService.security.minUsernameLength;
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
      return user.id === Number.parseInt(searchInput) || user.username.indexOf(searchInput) !== -1;
    })

  }

  /**
   * Request a secure login link for the given user.
   */
  public requestSecureLink(user: User): void {

    this.setStatus(StatusKey.LOGIN_LINK, StatusValue.IN_PROGRESS);
    this.adminService.requestLoginKey(user.id, (token: string) => {
      this.setStatus(StatusKey.LOGIN_LINK, StatusValue.SUCCESSFUL);
      user.secureLoginLink = this.envService.endpoints.loginKeyUrl(token);
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

    let isAdd = !user.roles.some(r => toggleRole.id == r.id);

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
        user.roles = user.roles.filter(r => toggleRole.id != r.id);
      }, (error: HttpErrorResponse, apiError: ApiError) => {
        this.setStatus(StatusKey.MODIFY_ROLE, StatusValue.FAILED);
      });
    }

  }

  /**
   * Whether the given origRoles contains the given role findRole.
   */
  public containsRole(origRoles: Array<Role>, findRole: Role): boolean {
    return origRoles.some(r => r.id == findRole.id);
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
