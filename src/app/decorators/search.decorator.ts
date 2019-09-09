/**
 * Marks for search by the SearchService.
 *
 * @author Laurenz Fiala
 * @since 2019/08/30
 */
import {SearchService} from '../services/search.service';
import {SearchDescriptor} from '../entities/search-descriptor.entity';

export function search(applicableSearchIds?: string | Array<string>, translationKey?: string, qualifier: string | boolean = true): any {
  return function decoratorFn(target: any, propertyKey: string): void {

    if (typeof applicableSearchIds === 'string') {
      applicableSearchIds = [applicableSearchIds];
    }

    let usingQualifier: string;
    if (typeof qualifier === 'boolean') {
      if (qualifier) {
        usingQualifier = propertyKey;
      }
    } else {
      usingQualifier = qualifier;
    }

    let descriptor = new SearchDescriptor(propertyKey);
    if (applicableSearchIds || translationKey || qualifier) {
      descriptor = new SearchDescriptor(propertyKey, applicableSearchIds, translationKey, usingQualifier);
    }
    if (target[SearchService.SEARCH_SVC_FIELD_KEY]) { // add to array
      (<Array<SearchDescriptor>>target[SearchService.SEARCH_SVC_FIELD_KEY]).push(descriptor);
    } else { // create new array field
      target[SearchService.SEARCH_SVC_FIELD_KEY] = new Array<SearchDescriptor>(descriptor);
    }

  };
}
