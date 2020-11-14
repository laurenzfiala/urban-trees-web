import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';

/**
 * Structural directive to create the contained
 * template n times.
 *
 * @author Laurenz Fiala
 * @since 2020/05/16
 */
@Directive({
  selector: '[forN]'
})
export class ForNDirective {

  @Input('forN')
  set forN(n: number | {start, end}) {

    let start = 0;
    let end;
    if (typeof n === 'number') {
      end = n - 1;
    } else if (typeof n === 'object') {
      if (n.start) {
        start = n.start;
      }
      if (n.end) {
        end = n.end;
      }
    } else {
      throw new Error('Invalid argument for forN directive.');
    }

    this.viewContainer.clear();
    for (let i = 0; i <= end - start; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {index: i + start}, i);
    }

  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

}
