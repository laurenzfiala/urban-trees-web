import { Pipe, PipeTransform } from '@angular/core';
import {StringModificationPipe, StringModificationType} from "./strmod.pipe";

@Pipe({name: 'lowercase'})
export class LowercasePipe implements PipeTransform {

  public transform(value: string): string {

    return new StringModificationPipe().transform(value, StringModificationType.LOWERCASE);

  }

}
