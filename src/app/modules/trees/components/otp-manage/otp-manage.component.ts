import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {AccountService} from '../../services/account.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {AuthService} from '../../../shared/services/auth.service';
import {Log} from '../../../shared/services/log.service';

@Component({
  selector: 'ut-otp-manage',
  templateUrl: './otp-manage.component.html',
  styleUrls: ['./otp-manage.component.less', '../project-login/project-login.component.less']
})
export class OtpManageComponent extends AbstractComponent implements OnInit {

  private static LOG: Log = Log.newInstance(OtpManageComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public isActive: boolean;
  public isActivateFlow: boolean;
  public forceLogout: boolean;
  public forceLogoutUsername: string;

  public otp: string;
  public scratchCodes: Array<string>;

  constructor(private authService: AuthService,
              private accountService: AccountService,
              private envService: EnvironmentService,
              private cdRef: ChangeDetectorRef) {
    super();
  }

  public ngOnInit(): void {
    this.checkState();
  }

  /**
   * Check whether user has turned OTP on or off and update
   * #isActive and #isActivateFlow.
   */
  private checkState(): void {

    if (this.authService.isTempActivateOTP()) {
      this.isActivateFlow = true;
      this.isActive = false;
      this.forceLogout = true;
      this.forceLogoutUsername = this.authService.getUsername();
      this.setStatus(StatusKey.CHECK_STATE, StatusValue.SUCCESSFUL);
      return;
    }

    this.forceLogout = false;
    this.setStatus(StatusKey.CHECK_STATE, StatusValue.IN_PROGRESS);
    this.accountService.isOtpActive((response: boolean) => {
      this.isActive = response;
      this.isActivateFlow = !response;
      this.setStatus(StatusKey.CHECK_STATE, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.CHECK_STATE, StatusValue.FAILED);
    });

  }

  /**
   * Try to activate OTP using the given OTP code.
   * If successful, set the scratch codes to display.
   */
  public activate(): void {

    this.setStatus(StatusKey.ACTIVATE, StatusValue.IN_PROGRESS);
    this.accountService.activateOtp(this.otp, (scratchCodes: Array<string>) => {
      this.isActive = true;
      this.scratchCodes = scratchCodes;
      this.setStatus(StatusKey.ACTIVATE, StatusValue.SUCCESSFUL);
      if (this.forceLogout) {
        OtpManageComponent.LOG.info('Logging out user because logout after password change was forced');
        this.authService.logout();
        this.cdRef.detectChanges();
      }
    }, (error, apiError) => {
      this.otp = undefined;
      if (error.status === 0) {
        this.setStatus(StatusKey.ACTIVATE, StatusValue.FAILED_CONNECTION);
      } else {
        this.setStatus(StatusKey.ACTIVATE, StatusValue.FAILED);
      }
    });

  }

  /**
   * Try to deactivate OTP using the given OTP code.
   */
  public deactivate(): void {

    this.setStatus(StatusKey.DEACTIVATE, StatusValue.IN_PROGRESS);
    const otp = this.otp.replace(' ', '').replace('-', '');
    this.accountService.deactivateOtp(otp, () => {
      this.isActive = false;
      this.setStatus(StatusKey.DEACTIVATE, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.otp = undefined;
      if (error.status === 0) {
        this.setStatus(StatusKey.DEACTIVATE, StatusValue.FAILED_CONNECTION);
      } else {
        this.setStatus(StatusKey.DEACTIVATE, StatusValue.FAILED);
      }
    });

  }

  public activationLink(): string {
    return this.envService.endpoints.activateOtp;
  }

  public username(): string {
    let username = this.authService.getUsername();
    if (this.forceLogoutUsername && !this.authService.isLoggedIn()) {
      username = this.forceLogoutUsername;
    }
    return username;
  }

}

export enum StatusKey {

  CHECK_STATE,
  ACTIVATE,
  DEACTIVATE

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2,
  FAILED_CONNECTION = 3
}
