import {Directive, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';

@Directive({
  selector: '[check]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: CheckDirective, multi: true}
  ]
})
export class CheckDirective implements Validator {

  @Input('check')
  private check: (newVal?: any) => boolean;

  constructor() { }

  registerOnValidatorChange(fn: () => void): void {
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (!this.check || !this.check(control.value)) {
      return [{check: 'Check failed'}];
    }
    return undefined;
  }

}
