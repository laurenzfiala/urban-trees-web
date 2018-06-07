import {Directive, ElementRef, EventEmitter, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[spy]'
})
export class SpyDirective implements OnInit {

  /**
   * TODO
   * @type {EventEmitter<any>}
   */
  @Output('init')
  public onInitEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor(private el: ElementRef) { }

  public ngOnInit(): void {
    this.onInitEmitter.emit(this.el);
  }

}
