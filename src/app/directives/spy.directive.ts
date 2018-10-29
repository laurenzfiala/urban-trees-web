import {Directive, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';

/**
 * Utility directive to return the attached
 * element via an output-event to the parent
 * component.
 *
 * @author Laurenz Fiala
 * @since 2018/07/05 (doc)
 */
@Directive({
  selector: '[spy]'
})
export class SpyDirective implements OnInit {

  /**
   * Fires only once upon finished initialization
   * of the attached element (ngOnInit).
   * @type {EventEmitter<any>}
   */
  @Output('init')
  public onInitEmitter: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();

  constructor(private el: ElementRef) { }

  public ngOnInit(): void {
    this.onInitEmitter.emit(this.el);
  }

}
