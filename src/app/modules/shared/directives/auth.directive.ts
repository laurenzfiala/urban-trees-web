import {Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

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
export class AuthDirective implements OnInit, OnDestroy {

  @Input('auth')
  private grantRoles: string[] = [];

  @Input('authElse')
  private templateRefElse: TemplateRef<any>;

  @Input('authCheckChanges')
  private authCheckChanges: boolean = true;

  private authServiceOnStateChanged: Subscription;

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnInit(): void {

    this.do();
    if (this.authCheckChanges) {
      this.authServiceOnStateChanged = this.authService.onStateChanged().subscribe(value => {
        this.do();
      });
    }

  }

  private do(): void {

    this.viewContainer.clear();

    // if user roles are accepted by the service, or we accept logged in users if no grant roles are required
    if (this.authService.isUserRoleAccessGranted(this.grantRoles) || (this.authService.isLoggedIn() && !this.grantRoles)) {
      if (this.templateRef) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      if (this.templateRefElse) {
        this.viewContainer.createEmbeddedView(this.templateRefElse);
      }
    }

  }

  public ngOnDestroy(): void {

    if (this.authServiceOnStateChanged) {
      this.authServiceOnStateChanged.unsubscribe();
    }

  }

}
