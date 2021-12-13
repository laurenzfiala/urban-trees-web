import {TranslateLoader} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable, of} from 'rxjs';
import {VERSION} from '../../../../environments/version';
import {catchError, reduce, switchMap} from 'rxjs/operators';
import {Log} from '../services/log.service';
import {merge} from 'rxjs-compat/operator/merge';

/**
 * Describes a translation file to be loaded by the TranslateHttpLoader.
 */
export interface TranslationSource {
  prefix: string;
  suffix: string;
}

/**
 * Adds capability of multiple translation sources to the standard TranslateHttpLoader.
 */
export class MultiTranslateHttpLoader implements TranslateLoader {

  private static LOG: Log = Log.newInstance(MultiTranslateHttpLoader);

  constructor(
    private http: HttpClient,
    private sources: Array<TranslationSource>
  ) {}

  public getTranslation(lang: string): Observable<any> {

    const requests = this.sources.map(source => {
      const path = source.prefix + lang + source.suffix + this.cacheBustSuffix();
      return this.http.get(path).pipe(catchError(e => {
        MultiTranslateHttpLoader.LOG.error('Failed to receive translation source: ' + path, e);
        return of({});
      }));
    });
    return forkJoin(requests)
      .pipe(switchMap(value => value))
      .pipe(reduce<any, any>( (acc, response) => Object.assign(acc, response)));

  }

  private cacheBustSuffix(): string {
    return '?version=' + VERSION.version;
  }

}
