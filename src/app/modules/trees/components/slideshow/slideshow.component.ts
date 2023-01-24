import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {interval, Subscription} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'ut-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.less']
})
export class SlideshowComponent implements OnInit, OnDestroy {

  @ViewChild('predefImgSlide', {static: true})
  public predefImgSlide: TemplateRef<any>;

  @Input()
  public slides: Array<TemplateRef<any> | any>;

  @Input()
  public slideTemplate: TemplateRef<any>;

  @Input()
  public intervalMs: number = 3000;

  @Input()
  public slideSubtitles: Array<string>;

  public internalPause: boolean = false;

  public nextSlideSubscription: Subscription;

  @Input()
  set pause(value: boolean) {
    this.internalPause = value;
    if (value) {
      if (this.nextSlideSubscription) {
        this.nextSlideSubscription.unsubscribe();
        this.nextSlideSubscription = null;
      }
    } else {
      this.startShow();
    }
  }

  private slideIndex: number = 0;

  constructor() { }

  public ngOnInit() {
    this.startShow();
  }

  public ngOnDestroy() {
    if (this.nextSlideSubscription) {
      this.nextSlideSubscription.unsubscribe();
      this.nextSlideSubscription = null;
    }
  }

  private startShow(): void {

    if (this.nextSlideSubscription) {
      return;
    }

    this.nextSlideSubscription = interval(this.intervalMs)
      .pipe(takeWhile(val => !this.internalPause))
      .subscribe(i => {
        this.nextSlide();
      });

  }

  public getCurrentSlide(): TemplateRef<any> {
    if (this.slides === undefined) {
      return null;
    }
    const currentSlide = this.slides[this.slideIndex];
    if (currentSlide instanceof TemplateRef) {
      return <TemplateRef<any>>currentSlide;
    } else {
      return this.slideTemplate;
    }
  }

  public getCurrentSlideContext(): any {
    if (this.slides === undefined) {
      return null;
    }
    let currentSlide = this.slides[this.slideIndex];
    if (currentSlide instanceof TemplateRef) {
      return null;
    }
    return Object.assign({}, currentSlide);
    /*
      why do we need this copy?
      if not used, element 0 is changed to current slide. i could not find the reason 2019/08/29
     */
  }

  /*public getNextSlide(): TemplateRef<any> {
    if (this.slides === undefined) {
      return null;
    }
    return this.slides[this.getNextSlideIndex()];
  } TODO */

  public nextSlide(): void {
    this.slideIndex = this.getNextSlideIndex();
  }

  public previousSlide(): void {
    this.slideIndex = this.getPreviousSlideIndex();
  }

  private getNextSlideIndex(): number {
    if (this.slideIndex + 1 >= this.slides.length) {
      return 0;
    } else {
      return this.slideIndex + 1;
    }
  }

  private getPreviousSlideIndex(): number {
    if (this.slideIndex - 1 >= 0) {
      return this.slideIndex - 1;
    } else {
      return this.slides.length - 1;
    }
  }

  public getProgress(): number {
    if (this.slides === undefined || this.slides.length === 0) {
      return 0;
    }
    return (this.slideIndex + 1) / this.slides.length * 100;
  }

  public getCurrentSubtitle(): string {
    if (!this.slideSubtitles || this.slideSubtitles.length <= this.slideIndex) {
      return undefined;
    }
    return this.slideSubtitles[this.slideIndex];
  }

}
