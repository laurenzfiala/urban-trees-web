import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs/observable';
import {_throw} from 'rxjs/observable/throw';
import 'rxjs/add/operator/catch';
import {Router, RouterStateSnapshot} from '@angular/router';
import {Log} from '../services/log.service';
import {AuthService} from '../services/auth.service';
import {LoginAccessReason} from '../components/project-login/logout-reason.enum';
import {EnvironmentService} from '../services/environment.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private static LOG: Log = Log.newInstance(AuthInterceptor);

  constructor(private authService: AuthService,
              private router: Router,
              private envService: EnvironmentService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let routerState = this.router.routerState.snapshot;
    AuthInterceptor.LOG.trace('Intercepting http request.');

    const token = AuthService.getJWTTokenRaw();
    const apiKey = AuthService.getApiKeyRaw();

    let newRequest;
    if (token) {
      newRequest = req.clone({headers: req.headers.set(AuthService.HEADER_AUTH_KEY, token)});
    } else if (apiKey) {
      newRequest = req.clone({headers: req.headers.set(AuthService.HEADER_API_KEY, apiKey)});
    } else {
      newRequest = req;
    }

    AuthInterceptor.LOG.trace('Added auth headers to http request.');

    return next.handle(newRequest)
      .catch(error => {

        if (error instanceof HttpErrorResponse && error.status === 403 && !this.isExcludedRoute(routerState)) {
          AuthInterceptor.LOG.debug('Received unauthorized response from backend. Redirecting to login...');
          this.authService.redirectToLogin(this.authService.getLogOutReason(true), routerState.url);
        }

        return _throw(error);

      }) as any;

  }

  /**
   * Checks whether the given router state points to an URL
   * that starts with one of the excluded routes. If so, returns true.
   * @param routeSnapshot RouterStateSnapshot
   */
  private isExcludedRoute(routeSnapshot: RouterStateSnapshot): boolean {

    for (let exclusion of this.envService.security.interceptorRedirectExclusions) {
      if (routeSnapshot.url.indexOf(exclusion) === 0) {
        return true;
      }
    }
    return false;

  }

}
