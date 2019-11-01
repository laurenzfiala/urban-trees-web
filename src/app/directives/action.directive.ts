import {Directive, EventEmitter, HostListener, Input, NgZone, Output} from '@angular/core';

@Directive({
  selector: '[action]'
})
export class ActionDirective {

  @Output()
  private action: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private zone: NgZone) { }

  @HostListener('click', ['$event'])
  @HostListener('keyup.enter', ['$event'])
  public onAction(event: Event): void {
    this.action.next(event);
  }

}
