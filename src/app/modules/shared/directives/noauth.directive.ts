import {Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';

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
export class NoAuthDirective implements OnInit, OnDestroy {

  @Input('noauth')
  private includeAnonymous: boolean = false;

  @Input('noauthCheckChanges')
  private noauthCheckChanges: boolean = true;

  /**
   * Rarely content may be added multiple times, which we prevent with this switch.
   */
  private isRemoved: boolean = true;

  private authServiceOnStateChanged: Subscription;

  constructor(
    private authService: AuthService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnInit(): void {

    this.do();
    if (this.noauthCheckChanges) {
      this.authServiceOnStateChanged = this.authService.onStateChanged().subscribe(value => {
        this.do();
      });
    }

  }

  private do(): void {

    if (!this.authService.isLoggedIn() || (this.includeAnonymous && this.authService.isUserAnonymous())) {
      if (this.isRemoved) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
      this.isRemoved = false;
    } else {
      if (!this.isRemoved) {
        this.viewContainer.clear();
      }
      this.isRemoved = true;
    }

  }

  public ngOnDestroy(): void {

    if (this.authServiceOnStateChanged) {
      this.authServiceOnStateChanged.unsubscribe();
    }

  }

}
