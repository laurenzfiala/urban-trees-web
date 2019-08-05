import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import 'rxjs-compat/add/operator/takeWhile';

@Component({
  selector: 'ut-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.less']
})
export class SlideshowComponent implements OnInit, OnDestroy {

  @Input()
  public slides: Array<TemplateRef<any>>;

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

  public slideIndex: number = 0;

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
      .takeWhile(val => !this.internalPause)
      .subscribe(i => {
        this.nextSlide();
      });

  }

  public getCurrentSlide(): TemplateRef<any> {
    if (this.slides === undefined) {
      return null;
    }
    return this.slides[this.slideIndex];
  }

  public getNextSlide(): TemplateRef<any> {
    if (this.slides === undefined) {
      return null;
    }
    return this.slides[this.getNextSlideIndex()];
  }

  private nextSlide(): void {
    this.slideIndex = this.getNextSlideIndex();
  }

  private previousSlide(): void {
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
