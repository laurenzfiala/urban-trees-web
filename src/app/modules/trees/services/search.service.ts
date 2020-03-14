import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../../shared/services/abstract.service';
import {ApiError} from '../../shared/entities/api-error.entity';
import {UserAchievements} from '../entities/user-achievement.entity';
import {UserData} from '../entities/user-data.entity';
import {interval, Observable} from 'rxjs';
import {SubscriptionManagerService} from './subscription-manager.service';
import {AuthService} from '../../shared/services/auth.service';
import {Report} from '../entities/report.entity';
import {SearchDescriptor} from '../entities/search-descriptor.entity';
import {TranslateService} from '@ngx-translate/core';

/**
 * SService used for searching object-members for values.
 *
 * @author Laurenz Fiala
 * @since 2019/08/30
 */
@Injectable()
export class SearchService extends AbstractService implements OnInit {

  /**
   * Object field key to store all searchable fields marked
   * with @search.
   */
  public static SEARCH_SVC_FIELD_KEY = '_searchableFields';

  private static LOG: Log = Log.newInstance(SearchService);

  /**
   * Whether the search service is ready to be used or not.
   */
  private ready: boolean = false;

  constructor(private translateService: TranslateService) {
    super();
  }

  public ngOnInit(): void {

    this.translateService.get('app.title').subscribe(value => {
      this.ready = true;
    });

  }

  public async search<T>(input: Array<T>,
                         searchValue: string,
                         searchId?: string,
                         comparator?: (fieldValue: any, searchValue: string) => Promise<boolean>,
                         maxRecursionDepth: number = 1,
                         recursionDepth: number = 0): Promise<Array<T>> {

    if (!input || input.length === 0) {
      return Promise.resolve([]);
    }
    if (!searchValue || searchValue.length === 0) {
      return Promise.resolve(input);
    }

    const foundElements: Set<T> = new Set<T>();

    for (let el of input) {
      const searchableFields: Array<SearchDescriptor> = el[SearchService.SEARCH_SVC_FIELD_KEY];
      if (!searchableFields) {
        continue;
      }
      for (let searchDescriptor of searchableFields) {
        if (!foundElements.has(el) &&
            el[searchDescriptor.key] &&
            await this.equals(
              searchId,
              el[searchDescriptor.key],
              el,
              searchDescriptor,
              searchValue,
              undefined,
              maxRecursionDepth,
              recursionDepth
            )) {
          foundElements.add(el);
        }
      }
    }

    return Promise.resolve(Array.from(foundElements));

  }

  /**
   * TODO
   * Supports: object identity (string), string contains, number (only matches if all digits are equal)
   * String translation is automatically used when @search decorator has the corresponding parameter translationKey.
   * @param searchId
   * @param fieldValue
   * @param searchDescriptor
   * @param searchValue
   * @param comparator
   * @param maxRecursionDepth
   * @param recursionDepth
   */
  private async equals(searchId: string,
                       fieldValue: any,
                       object: any,
                       searchDescriptor: SearchDescriptor,
                       searchValue: string,
                       comparator?: (field: any, searchValue: string) => Promise<boolean>,
                       maxRecursionDepth: number = 1,
                       recursionDepth: number = 0): Promise<boolean> {

    // 1 ----- SKIP NON-APPLICABLE SEARCHES -----
    if (searchId && !searchDescriptor.isApplicableForSearchId(searchId)) {
      return Promise.resolve(false);
    }
    // 2 ----- USE COMPARATOR INSTEAD OF DEFAULT CHECKS (OPTIONAL) -----
    if (comparator) {
      return comparator(fieldValue, searchValue);
    }
    // 3 ----- CHECK QUALIFIER & STRIP IT FROM SEARCH VALUE -----
    if (searchDescriptor.qualifier && searchValue.indexOf(searchDescriptor.qualifier + ':') === 0) {
      searchValue = searchValue.substring(searchDescriptor.qualifier.length + 1);
    }
    // 4 ----- STRING CHECKS -----
    if (typeof fieldValue === 'string') {
      // use translated value (optional)
      if (searchDescriptor && searchDescriptor.translationKey) {
        fieldValue = await this.getTranslation(fieldValue, object, searchDescriptor);
      }
      // identity
      if (fieldValue === searchValue) {
        return Promise.resolve(true);
      }
      // contains
      if (fieldValue.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1) {
        return Promise.resolve(true);
      }
    }
    // 5 ----- NUMBER CHECKS -----
    if (typeof fieldValue === 'number' && !isNaN(Number(searchValue)) && fieldValue === Number(searchValue)) {
      return Promise.resolve(true);
    }

    // ----- DEEP SEARCH -----
    // limit depth
    if (recursionDepth === maxRecursionDepth) {
      return Promise.resolve(false);
    }

    // do deep search
    let returnVal = false;
    if (fieldValue instanceof Array) {
      returnVal = (await this.search(fieldValue, searchValue, searchId, comparator, maxRecursionDepth, recursionDepth + 1)).length > 0;
    } else if (fieldValue instanceof Object) {
      returnVal = (await this.search([fieldValue], searchValue, searchId, comparator, maxRecursionDepth, recursionDepth + 1)).length > 0;
    }

    // true if deep search was successful, false otherwise
    return Promise.resolve(returnVal);

  }

  private async getTranslation(fieldValue: string, object: any, searchDescriptor: SearchDescriptor): Promise<string> {
    return this.translateService.get(this.parseTranslationKey(searchDescriptor.translationKey, object)).toPromise();
  }

  private parseTranslationKey(translationKey: string, object: any): string {

    return translationKey.replace(/\{\{(.+?)\}\}/g, (substring, args) => {
      if (!args) {
        return substring;
      }
      let value: string = object[args];
      value = object[args.substring(0, args.lastIndexOf(' |') !== -1 ? args.lastIndexOf(' |') : args.lastIndexOf('|'))];
      if (args.endsWith('| lowercase')) {
        value = value.toLowerCase();
      } else if (args.endsWith('| uppercase')) {
        value = value.toUpperCase();
      }
      return value;
    });

  }

}
