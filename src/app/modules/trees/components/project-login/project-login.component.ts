import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';
import {LoginAccessReason} from './logout-reason.enum';
import {LoginStatus} from './login-status.enum';
import {UserAuthenticationToken, UserOtpAuthenticationToken} from '../../entities/auth-token.entity';

@Component({
  selector: 'ut-project-login',
  templateUrl: './project-login.component.html',
  styleUrls: ['./project-login.component.less']
})
export class ProjectLoginComponent extends AbstractComponent implements OnInit, AfterViewInit {

  /**
   * Header key to check additional requirements for login.
   */
  public static HTTP_HEADER_AUTH_REQUIRES_KEY: string = 'Authentication-Requires';

  private static QUERY_PARAMS_LOGIN_REASON_KEY: string = 'reason';

  private static QUERY_PARAMS_REDIRECT_KEY: string = 'redirect';

  public LoginAccessReason = LoginAccessReason;
  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Component is embedded outside of the login page.
   */
  @Input()
  public embed: boolean = false;

  /**
   * Don't inform of login, but provide the login inputs anyways.
   */
  @Input()
  public relog: boolean = false;

  /**
   * Show disclaimer or not.
   */
  @Input()
  public disclaimer: boolean = true;

  /**
   * Emit event when logged in.
   */
  @Output()
  public loggedin: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('usernameInput')
  private usernameInput: ElementRef;

  @ViewChild('passwordInput')
  private passwordInput: ElementRef;

  @ViewChild('otpInput')
  private otpInput: ElementRef;

  public accessReason: LoginAccessReason;

  /**
   * Where to redirect to as soon as the
   * user is logged in.
   */
  public redirectTo: string;

  /**
   * Whether to show the text on how data is used etc.
   */
  public showDataDisclaimer: boolean = false;

  /**
   * Whether to show the OTP input or not.
   */
  public showOtp: boolean = false;

  public username: string;
  public password: string;
  public otp: string;

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
        if (this.isAlreadyLoggedIn()) {
          this.router.navigateByUrl(this.redirectTo);
        }
      } else if (!this.relog) {
        this.redirectTo = '/home';
      }

    });

    // pre-fill username if a token exists
    let username = this.authService.getUsername(true);
    if (username) {
      this.username = username;
    }

  }

  /**
   * Autofocus username (or password, if username is prefilled) field
   */
  public ngAfterViewInit(): void {

    if (this.username) {
      this.passwordInput?.nativeElement.focus();
    } else {
      this.usernameInput?.nativeElement.focus();
    }

  }

  /**
   * Login the user using entered credentials.
   */
  public login(): void {

    this.setStatus(StatusKey.LOGIN, StatusValue.IN_PROGRESS);

    let loginEntity;
    if (this.otp && this.otp.length > 0) {
      const otp = this.otp.replace(' ', '').replace('-', '');
      loginEntity = new UserOtpAuthenticationToken(this.username, this.password, otp);
    } else {
      loginEntity = new UserAuthenticationToken(this.username, this.password);
    }

    this.authService.login(loginEntity, () => {
      this.setStatus(StatusKey.LOGIN, StatusValue.SUCCESSFUL);
      this.consecutiveFailedLoginAttempts = 0;

      this.redirectTo = this.authService.getRedirectAfterLogin(this.redirectTo);
      if (this.redirectTo) {
        this.router.navigateByUrl(this.redirectTo);
      }

      this.loggedin.emit();
    }, (error, apiError) => {
      let t = error.headers.get(ProjectLoginComponent.HTTP_HEADER_AUTH_REQUIRES_KEY);
      if (t === 'OTP') {
        this.showOtp = true;
        this.setStatus(StatusKey.LOGIN, StatusValue.ENTER_OTP);
        return;
      }

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
  FAILED,
  ENTER_OTP

}
