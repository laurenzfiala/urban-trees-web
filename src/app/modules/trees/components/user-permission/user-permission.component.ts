import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {AuthService} from '../../../shared/services/auth.service';
import {UserIdentity} from '../../entities/user-identity.entity';

@Component({
  selector: 'ut-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.less', '../project-login/project-login.component.less']
})
export class UserPermissionComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  @Output()
  public selectedUser: EventEmitter<UserIdentity> = new EventEmitter<UserIdentity>();

  @Output()
  public deselectedUsers: EventEmitter<UserIdentity> = new EventEmitter<UserIdentity>();

  @Output()
  public newlyGrantedUsers: EventEmitter<UserIdentity> = new EventEmitter<UserIdentity>();

  @Input()
  public permission: string;

  public grantingUsers: Set<UserIdentity> = new Set<UserIdentity>();
  public selectedUsers: Set<UserIdentity> = new Set<UserIdentity>();

  public username: string;
  public password: string;

  public addNew: boolean = false;

  constructor(private authService: AuthService) {
    super();
  }

  public ngOnInit(): void {

    this.loadGrantedUsers();

  }

  private loadGrantedUsers(): void {

    if (!this.permission) {
      this.setStatus(StatusKey.GRANT_USERS, StatusValue.FAILED);
      return;
    }

    this.setStatus(StatusKey.GRANT_USERS, StatusValue.IN_PROGRESS);
    this.authService.loadUsersGrantingPermission(this.permission, (grantingUsers: Set<UserIdentity>) => {
      this.grantingUsers = grantingUsers;
      this.addNew = grantingUsers.size === 0;
      this.setStatus(StatusKey.GRANT_USERS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.GRANT_USERS, StatusValue.FAILED);
    });

  }

  public request(): void {

    if (this.username === this.getUsername()) {
      this.setStatus(StatusKey.REQUEST, StatusValue.SAME_ACCOUNT);
      return;
    }

    this.setStatus(StatusKey.REQUEST, StatusValue.IN_PROGRESS);
    this.authService.addUserPermission(this.permission, this.username, this.password, (result: UserIdentity) => {
      this.grantingUsers.add(result);
      this.newlyGrantedUsers.emit(result);
      this.toggleUser(result);
      this.addNew = false;
      this.setStatus(StatusKey.REQUEST, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.REQUEST, StatusValue.FAILED);
    });

  }

  public toggleUser(u: UserIdentity): void {
    if (this.selectedUsers.has(u)) {
      this.selectedUsers.delete(u);
      this.deselectedUsers.emit(u);
    } else {
      this.selectedUsers.add(u);
      this.selectedUser.emit(u);
    }
  }

  /**
   * Whether the client is on a secure connection or not.
   */
  public isSslConnection(): boolean {
    return this.authService.isSslConnection();
  }

  public getUsername(): string {
    return this.authService.getUsername();
  }

}

export enum StatusKey {

  REQUEST,
  GRANT_USERS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  SAME_ACCOUNT

}
