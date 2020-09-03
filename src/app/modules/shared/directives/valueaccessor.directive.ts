import {Directive, ElementRef, EventEmitter, Input, Output, Renderer2} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Directive({
  selector: '[va]',
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: ValueaccessorDirective, multi: true},
  ]
})
export class ValueaccessorDirective {

  @Input('vaStoreFn')
  private storeFn: (obj: any) => void;

  @Input('vaChangeFn')
  private changeFn: () => void;

  @Output('vaChange')
  public changeEmitter: EventEmitter<any> = new EventEmitter<any>();

  private internalValue: any;

  constructor(private renderer: Renderer2, private elRef: ElementRef) { }

  registerOnChange(fn: any): void {
    if (!this.changeFn) {
      this.changeFn = fn;
    }
  }

  registerOnTouched(fn: any): void {
    this.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setAttribute(this.elRef.nativeElement, 'disabled', isDisabled ? 'true' : null);
  }

  writeValue(obj: any): void {
    this.internalValue = obj;
    this.changeEmitter.emit(obj);
    if (this.storeFn) {
      this.storeFn(obj);
    }
  }

  change($event): void {
    this.writeValue($event);
  }

}
