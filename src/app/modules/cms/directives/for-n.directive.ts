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
  set forN(n: number) {

    this.viewContainer.clear();
    for (let i = 0; i < n; i++) {
      this.viewContainer.createEmbeddedView(this.templateRef, {index: i}, i);
    }

  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

}
