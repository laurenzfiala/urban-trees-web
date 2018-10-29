import {Directive, ElementRef, Input, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';

/**
 * Conditional directive to hide elements
 * which are only supposed to be seen by
 * privileged users.
 *
 * @author Laurenz Fiala
 * @since 2018/07/05
 */
@Directive({
  selector: '[auth]'
})
export class AuthDirective {

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input()
  set auth(grantRoles: string[]) {

    if (this.authService.isUserRoleAccessGranted(grantRoles)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }

  }

}
