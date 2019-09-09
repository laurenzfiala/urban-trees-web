import {Pipe, PipeTransform} from '@angular/core';
import {StringModificationPipe, StringModificationType} from './strmod.pipe';

@Pipe({name: 'replace'})
export class ReplacePipe implements PipeTransform {

  public transform(value: string, searchVal: string, replaceVal: string): string {

    return value.split(searchVal).join(replaceVal);

  }

}
