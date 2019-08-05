import {
  Component,
  ContentChild,
  ElementRef, EventEmitter,
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
  private content: TemplateRef<any>;

  @Input()
  private fullscreenContent: TemplateRef<any>;

  @Output()
  private opening: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private opened: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private closing: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  private closed: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isShown: boolean = false;
  public isClosing: boolean = false;

  constructor(private viewContainer: ViewContainerRef) { }

  public ngOnInit() {

  }

  public open(): void {
    this.isShown = true;
    this.opening.emit();
    this.delay(300).then(value => {
      this.opened.emit();
    });
  }

  public close(): void {
    this.isShown = false;
    this.isClosing = true;
    this.closing.emit();
    this.delay(300).then(value => {
      this.isClosing = false;
      this.closed.emit();
    });
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(() => resolve(), ms));
  }

}
