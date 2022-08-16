import { Pipe, PipeTransform } from '@angular/core';

/**
 * Gets a maps entries and preserves their order.
 *
 * @author Mdelaf on github.com
 * @see https://github.com/angular/angular/issues/31420#issuecomment-671138557
 */
@Pipe({name: 'mapEntries'})
export class MapEntriesPipe implements PipeTransform {

  transform<K, V>(input: Map<K, V>): Array<any> {
    return Array.from(input).map(([key, value]) => ({ key, value }));
  }

}
