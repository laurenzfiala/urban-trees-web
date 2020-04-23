import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractComponent} from '../abstract.component';
import {AccountService} from '../../services/account.service';
import {EnvironmentService} from '../../services/environment.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'ut-otp-manage',
  templateUrl: './otp-manage.component.html',
  styleUrls: ['./otp-manage.component.less', '../project-login/project-login.component.less']
})
export class OtpManageComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public isActive: boolean;
  public isActivateFlow: boolean;

  public otp: string;
  public scratchCodes: Array<string>;

  constructor(private authService: AuthService,
              private accountService: AccountService,
              private envService: EnvironmentService) {
    super();
  }

  public ngOnInit(): void {
    this.checkState();
  }

  /**
   * Check whether user has turned OTP on or off and update #isActive.
   */
  private checkState(): void {

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
    }, (error, apiError) => {
      this.otp = undefined;
      this.setStatus(StatusKey.ACTIVATE, StatusValue.FAILED);
    });

  }

  /**
   * Try to deactivate OTP using the given OTP code.
   */
  public deactivate(): void {

    this.setStatus(StatusKey.DEACTIVATE, StatusValue.IN_PROGRESS);
    this.accountService.deactivateOtp(this.otp, () => {
      this.isActive = false;
      this.setStatus(StatusKey.DEACTIVATE, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.otp = undefined;
      this.setStatus(StatusKey.DEACTIVATE, StatusValue.FAILED);
    });

  }

  public activationLink(): string {
    return this.envService.endpoints.activateOtp;
  }

  public username(): string {
    return this.authService.getUsername();
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

}
