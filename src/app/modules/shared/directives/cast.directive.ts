import {Directive, ElementRef, Input, OnDestroy, OnInit, TemplateRef, Type, ViewContainerRef} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Subscription} from 'rxjs';
import {ToolbarDropdown} from '../../cms/entities/toolbar.entity';

/**
 * Conditional directive to TODO
 *
 * @author Laurenz Fiala
 * @since 2020/09/25
 */
@Directive({
  selector: '[cast]'
})
export class CastDirective implements OnInit {

  @Input('cast')
  private options: { in: any, castTo: Type<any> };

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnInit(): void {

    this.do();

  }

  private do(): void {

    this.viewContainer.clear();

    if (this.options.in instanceof this.options.castTo) {
      const viewRef = this.viewContainer.createEmbeddedView(this.templateRef);
      viewRef.context.out = this.options.in;
    } else {
      this.viewContainer.clear();
    }

  }

}
