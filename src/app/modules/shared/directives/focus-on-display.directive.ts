import {
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges, OnInit,
  Output,
  Renderer2,
  SimpleChanges
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * Focuses the element when it is shown.
 * This enables focusing on elements in *ngIf.
 *
 * Idea from: https://stackoverflow.com/a/65741287/2740014 (2021/02/19)
 */
@Directive({
  selector: '[focusOnDisplay]'
})
export class FocusOnDisplayDirective implements OnInit {

  constructor(private elementRef: ElementRef) {
  }

  public ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
