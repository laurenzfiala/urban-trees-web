import {Component, EventEmitter, HostListener, Input, Output, TemplateRef, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'ut-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.less']
})
export class ZoomComponent {

  public Mode = Mode;

  @Input()
  public content: TemplateRef<any>;

  @Input()
  public fullscreenContent: TemplateRef<any>;

  /**
   * If true, the zoom component will show a fullscreen-icon
   * overtop the given content and handle the open-event by itself.
   * If set to false, your component can control opening of the
   * zoom comp using #open(). The fullscreen-icon is not shown.
   * Defaults to true.
   */
  @Input()
  public managedOpen: boolean = true;

  /**
   * Which content mode should be used.
   * This is needed because different content needs to have different
   * modal-looks and/or varying layout.
   */
  @Input()
  public mode: Mode = Mode.DEFAULT;

  /**
   * Whether to show slideshow controls
   * for this zoom component, which means
   * #previous and #next can be emitted.
   * Defaults to false.
   */
  @Input()
  public showViewControls: boolean = false;

  @Output()
  private opening: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private opened: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private closing: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  private previous: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private next: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isShown: boolean = false;
  public isClosing: boolean = false;

  constructor(private viewContainer: ViewContainerRef) {}

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent) {

    if (!this.isShown) {
      return;
    }
    if (event.keyCode === 27 || event.code === 'Escape') { // escape
      this.close();
    }
    if (this.showViewControls) {
      if (event.keyCode === 37 || event.code === 'ArrowLeft') { // left arrow
        this.onPrevious();
      }
      if (event.keyCode === 39 || event.code === 'ArrowRight') { // right arrow
        this.onNext();
      }
    }

  }

  /**
   * Open the modal.
   * @param internalCall (default false) set to true if called from within zoom component
   */
  public open(internalCall: boolean = false): void {

    if ((internalCall && !this.managedOpen) || this.isShown) {
      return;
    }
    this.isShown = true;
    this.opening.emit();
    document.body.style.overflowY = 'hidden';
    this.delay(350).then(value => {
      this.opened.emit();
    });

  }

  /**
   * Close the modal.
   */
  public close(): void {

    if (!this.isShown) {
      return;
    }
    this.isShown = false;
    this.isClosing = true;
    this.closing.emit();
    document.body.style.overflowY = 'auto';
    this.delay(350).then(value => {
      this.isClosing = false;
      this.closed.emit();
    });

  }

  public onPrevious(): void {
    this.previous.emit();
  }

  public onNext(): void {
    this.next.emit();
  }

  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms));
  }

}

export enum Mode {
  DEFAULT,
  IMAGE
}
