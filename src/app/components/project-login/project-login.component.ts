import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Login} from '../../entities/login.entity';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginAccessReason} from './logout-reason.enum';
import {LoginStatus} from './login-status.enum';

@Component({
  selector: 'ut-project-login',
  templateUrl: './project-login.component.html',
  styleUrls: ['./project-login.component.less']
})
export class ProjectLoginComponent extends AbstractComponent implements OnInit {

  private static QUERY_PARAMS_LOGIN_REASON_KEY: string = 'reason';

  private static QUERY_PARAMS_REDIRECT_KEY: string = 'redirect';

  public LoginAccessReason = LoginAccessReason;
  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public accessReason: LoginAccessReason;

  public redirectTo: string;

  /**
   * Whether to show the text on how data is used etc.
   */
  public showDataDisclaimer: boolean = false;

  public username: string;
  public password: string;

  public consecutiveFailedLoginAttempts: number = 0;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.LOGIN, StatusValue.PENDING);

    this.route.queryParams.subscribe((params: any) => {

      const reasonVal = params[ProjectLoginComponent.QUERY_PARAMS_LOGIN_REASON_KEY];
      const redirectVal = params[ProjectLoginComponent.QUERY_PARAMS_REDIRECT_KEY];

      if (reasonVal) {
        this.accessReason = reasonVal;
      }
      if (redirectVal) {
        this.redirectTo = redirectVal;
      } else {
        this.redirectTo = '/home';
      }

    });

    // pre-fill username if a token exists
    let username = this.authService.getUsername();
    if (username) {
      this.username = username;
    }

  }

  /**
   * Login the user using entered credentials.
   */
  public login(): void {

    this.setStatus(StatusKey.LOGIN, StatusValue.IN_PROGRESS);
    let loginEntity = new Login(this.username, this.password);

    this.authService.login(loginEntity, () => {
      this.setStatus(StatusKey.LOGIN, StatusValue.SUCCESSFUL);
      this.consecutiveFailedLoginAttempts = 0;

      if (this.authService.isTempChangePasswordAuth()) {
        this.redirectTo = '/account/changepassword';
      }
      if (this.redirectTo) {
        this.router.navigate([this.redirectTo]);
      }
    }, (error, apiError) => {
      this.consecutiveFailedLoginAttempts++;
      if (apiError.statusCode === 403) {
        this.setStatus(StatusKey.LOGIN, StatusValue.BAD_CREDENTIALS);
      } else {
        this.setStatus(StatusKey.LOGIN, StatusValue.FAILED);
      }
    });

  }

  /**
   * Log the user out.
   */
  public logout(): void {
    this.authService.logout();
    this.accessReason = LoginAccessReason.USER_LOGOUT;
  }

  /**
   * Check if user is already logged in via the standard
   * JWT login.
   */
  public isAlreadyLoggedIn(): boolean {
    return this.authService.getLogInStatus() === LoginStatus.LOGGED_IN_JWT && this.accessReason !== LoginAccessReason.FORCE_CREDENTIALS_CONFIRM;
  }

  /**
   * Whether the client is on a secure connection or not.
   */
  public isSslConnection(): boolean {
    return this.authService.isSslConnection();
  }

  public hasManyFailedAttempts(): boolean {
    return this.consecutiveFailedLoginAttempts >= 3;
  }

}

export enum StatusKey {

  LOGIN

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  BAD_CREDENTIALS,
  FAILED

}
