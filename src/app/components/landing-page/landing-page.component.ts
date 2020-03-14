import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'ut-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit, AfterViewInit {

  private static CYCLE_INTERVAL_MS: number = 5000;

  @ViewChild('introModulesContentWrapper')
  public introModulesContentWrapper: ElementRef;

  public _runSlideCycle: boolean = false;
  private cycleIntervalId: number;

  set runSlideCycle(val: boolean) {
    this._runSlideCycle = val;

    if (this.cycleIntervalId) {
      clearInterval(this.cycleIntervalId);
    }
    this.startSlideCycle();
  }

  public moduleSlides: any = [
    {
      imageUrl: '/assets/landing-page/modules/module1.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture.'
    },
    {
      imageUrl: '/assets/landing-page/modules/module2.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture. (2)'
    },
    {
      imageUrl: '/assets/landing-page/modules/module3.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture. (3)'
    }
  ];

  constructor() { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

    this.showSlide(this.moduleSlides[0]);
    this.startSlideCycle();

  }

  private startSlideCycle(): void {

    this.cycleIntervalId = setInterval(() => {
      if (!this._runSlideCycle) {
        return;
      }
      let nextSlide = this.currentSlideIndex() + 1;
      if (nextSlide >= this.moduleSlides.length) {
        nextSlide = 0;
      }
      this.showSlide(this.moduleSlides[nextSlide]);
    }, LandingPageComponent.CYCLE_INTERVAL_MS);

  }

  public currentYear(): number {
    return new Date().getFullYear();
  }

  public showSlide(slide: any): void {

    for (let s of this.moduleSlides) {
      s.wasPreviouslyShown = s.isShown;
      s.isShown = false;
    }
    slide.isShown = true;
    let scrollEl = $(this.introModulesContentWrapper.nativeElement);
    let slideContentWidth = scrollEl.find('.intro-module')[0].clientWidth;
    let scrollLeftTarget = slideContentWidth * this.currentSlideIndex() - (window.innerWidth - slideContentWidth) / 2;
    scrollEl.stop().animate({scrollLeft: scrollLeftTarget}, 500);

  }

  private currentSlideIndex(): number {
    return this.moduleSlides.findIndex(s => s.isShown);
  }

  get selectedSlide(): any {
    return this.moduleSlides.find(s => s.isShown);
  }

}
