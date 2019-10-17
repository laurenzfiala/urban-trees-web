import {Directive, ElementRef, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

/**
 * Structural directive to hide elements
 * which are only supposed to be seen when a
 * certain language is set in the TranslateService.
 *
 * @author Laurenz Fiala
 * @since 2019/10/17
 */
@Directive({
  selector: '[lang]'
})
export class LangDirective implements OnInit {

  /**
   * Language to display.
   */
  @Input('lang')
  private displayLanguage: string;

  /**
   * Rarely content may be added multiple times, which we prevent with this switch.
   */
  private isRemoved: boolean = true;

  constructor(
    private translateService: TranslateService,
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  public ngOnInit(): void {
    this.do();
  }

  private do(): void {

    if (this.translateService.currentLang === this.displayLanguage) {
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

}
