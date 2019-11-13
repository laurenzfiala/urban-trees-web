import {Directive, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';

/**
 * See https://github.com/angular/angular/issues/9343.
 * Code also partly copied from comment.
 * @since 2019/02/18
 * @author Laurenz Fiala
 */
@Directive({
  selector: '[cssvar]'
})
export class CssVariableDirective implements OnChanges {

  @Input('cssvar')
  public properties: Property|Property[] = [];

  constructor(private element: ElementRef) { }

  public ngOnChanges(changes: SimpleChanges) {

    const set = (variable: Property) => {
      if (variable.value) {
        this.element.nativeElement.style.setProperty(variable.name, variable.value);
      } else {
        this.element.nativeElement.style.removeProperty(variable.name);
      }
    };

    if (changes.properties) {
      if (Array.isArray(this.properties)) {
        for (const v of this.properties) {
          set(v);
        }
      } else {
        set(this.properties);
      }
    }

  }

}

export interface Property {
  name: string;
  value: string;
}
