import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'replace'})
export class ReplacePipe implements PipeTransform {

  public transform(value: string, searchVal: string, replaceVal: string): string {

    return value.split(searchVal).join(replaceVal);

  }

}
