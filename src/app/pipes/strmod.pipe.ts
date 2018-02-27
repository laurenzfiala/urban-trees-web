import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'strmod'})
export class StringModificationPipe implements PipeTransform {

  public transform(value: string, type: StringModificationType): string {

    if (!value) {
      return null;
    }

    switch (type) {
      case StringModificationType.LOWERCASE:
        return value.toLowerCase();
      case StringModificationType.UPPERCASE:
        return value.toUpperCase();
      case StringModificationType.CAPITALIZE:
        return value.toLowerCase().split(' ').map((val, index, array) => {
          return val.charAt(0).toUpperCase() + val.slice(1);
        }).toString();
    }

  }

}

/**
 * Modification possibilities for the StringModificationPipe.
 */
export enum StringModificationType {

  LOWERCASE,
  UPPERCASE,
  CAPITALIZE

}
