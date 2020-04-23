import { Injectable } from '@angular/core';
import {AbstractService} from './abstract.service';
import {PasswordReset} from '../entities/password-reset.entity';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {ApiError} from '../entities/api-error.entity';
import {EnvironmentService} from './environment.service';
import {Log} from './log.service';
import {UserIdentity} from '../entities/user-identity.entity';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends AbstractService {

  private static LOG: Log = Log.newInstance(AccountService);

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Check if the current user has OTP enabled.
   * @param successCallback when response was successfully received form backend
   * @param errorCallback if response could not be received
   */
  public isOtpActive(successCallback: (response: boolean) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<boolean>(this.envService.endpoints.usingOtp)
      .subscribe((response: boolean) => {
        AccountService.LOG.debug('Successfully received OTP state.');
        successCallback(response);
      }, (e: any) => {
        AccountService.LOG.error('Failed to query OTP state: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Activate OTP given the current OTP code.
   * If the response is an error, let the user retry,
   * @param successCallback when response was successfully received form backend (param are the scratch codes)
   * @param errorCallback if response could not be received
   */
  public activateOtp(otp: string,
                     successCallback: (scratchCodes: Array<string>) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.post<Array<string>>(this.envService.endpoints.activateOtp, {'code': otp})
      .subscribe((scratchCodes: Array<string>) => {
        AccountService.LOG.debug('Successfully activated OTP.');
        successCallback(scratchCodes);
      }, (e: any) => {
        AccountService.LOG.error('Failed to activate OTP: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Deactivate OTP given the current OTP code.
   * @param successCallback when response was successfully received form backend
   * @param errorCallback if response could not be received
   */
  public deactivateOtp(otp: string,
                       successCallback: () => void,
                       errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.post(this.envService.endpoints.deactivateOtp, {'code': otp})
      .subscribe(() => {
        AccountService.LOG.debug('Successfully deactivated OTP.');
        successCallback();
      }, (e: any) => {
        AccountService.LOG.error('Failed to deactivate OTP: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}
