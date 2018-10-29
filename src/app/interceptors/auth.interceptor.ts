import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {Observable} from 'rxjs/observable';
import {_throw} from 'rxjs/observable/throw';
import 'rxjs/add/operator/catch';
import {Router} from '@angular/router';
import {Log} from '../services/log.service';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private static LOG: Log = Log.newInstance(AuthInterceptor);

  constructor(private authService: AuthService,
              private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    AuthInterceptor.LOG.trace('Intercepting http request.');

    const token = AuthService.getJWTTokenRaw();
    const apiKey = this.authService.getApiKey();

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

        if (error instanceof HttpErrorResponse && error.status === 403) {
          AuthInterceptor.LOG.debug('Received unauthorized response from backend. Redirecting to login...');
        }

        return _throw(error);

      }) as any;

  }

}
