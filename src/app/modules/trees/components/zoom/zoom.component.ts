import {
  Component,
  ContentChild,
  ElementRef, EventEmitter, HostListener,
  Input,
  OnInit, Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

@Component({
  selector: 'ut-zoom',
  templateUrl: './zoom.component.html',
  styleUrls: ['./zoom.component.less']
})
export class ZoomComponent implements OnInit {

  @Input()
  public content: TemplateRef<any>;

  @Input()
  public fullscreenContent: TemplateRef<any>;

  /**
   * Whether to show previous/next controls or not.
   */
  @Input()
  public showControls: boolean = false;

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

  constructor(private viewContainer: ViewContainerRef) { }

  public ngOnInit() {

  }

  @HostListener('window:keyup', ['$event'])
  private keyEvent(event: KeyboardEvent) {

    if (!this.isShown) {
      return;
    }
    if (event.keyCode === 27 || event.code === 'Escape') { // escape
      this.close();
    }
    if (this.showControls) {
      if (event.keyCode === 37 || event.code === 'ArrowLeft') { // left arrow
        this.onPrevious();
      }
      if (event.keyCode === 39 || event.code === 'ArrowRight') { // right arrow
        this.onNext();
      }
    }

  }

  public open(): void {
    if (this.isShown) {
      return;
    }
    this.isShown = true;
    this.opening.emit();
    document.body.style.overflowY = 'hidden';
    this.delay(300).then(value => {
      this.opened.emit();
    });
  }

  public close(): void {
    if (!this.isShown) {
      return;
    }
    this.isShown = false;
    this.isClosing = true;
    this.closing.emit();
    document.body.style.overflowY = 'auto';
    this.delay(300).then(value => {
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
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }

}
