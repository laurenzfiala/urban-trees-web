import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';

/**
 * Conditional directive to hide elements
 * which are only supposed to be seen by
 * unprivigelged (guest) users.
 *
 * @author Laurenz Fiala
 * @since 2018/11/30
 */
@Directive({
  selector: '[noauth]'
})
export class NoAuthDirective {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set noauth(dummyInput: string[]) {

    if (this.authService.isLoggedIn()) {
      this.viewContainer.clear();
    } else {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }

  }

}
