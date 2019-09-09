import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to transform numbers to n-decimal-places string.
 * @deprecated 2019/09/09 use angular number pipe instead
 * @author Laurenz Fiala
 * @since 2018/06/17
 */
@Pipe({
  name: 'decimalPlaces'
})
export class DecimalPlacesPipe implements PipeTransform {

  public transform(value: any, args?: any): any {

    if (!args || isNaN(Number(args))) {
      return null;
    }

    if (!value || isNaN(Number(value))) {
      return null;
    }

    return Number(value).toPrecision(args);

  }

}
