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
  set noauth(includeAnonymous: boolean) {

    if (!this.authService.isLoggedIn() || (includeAnonymous && this.authService.isUserAnonymous())) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

  }

}
