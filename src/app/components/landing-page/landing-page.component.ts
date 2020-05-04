import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
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

  public modules: any = [
    {
      title: 'Data2Sensor',
      imageUrl: '/assets/landing-page/modules/module1.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture.'
    },
    {
      title: 'Sensor2App',
      imageUrl: '/assets/landing-page/modules/module2.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture. (2)'
    },
    {
      title: 'App2Analyse',
      imageUrl: '/assets/landing-page/modules/module3.jpg',
      tabText: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.',
      imgDesc: 'This should describe what\'s going on in the picture. (3)'
    }
  ];

  constructor(private cdRef: ChangeDetectorRef) { }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {

    this.showSlide(this.modules[0]);
    this.runSlideCycle = true;

  }

  private startSlideCycle(): void {

    this.cycleIntervalId = setInterval(() => {
      if (!this._runSlideCycle) {
        return;
      }
      let nextSlide = this.currentSlideIndex() + 1;
      if (nextSlide >= this.modules.length) {
        nextSlide = 0;
      }
      this.showSlide(this.modules[nextSlide]);
    }, LandingPageComponent.CYCLE_INTERVAL_MS);

  }

  public currentYear(): number {
    return new Date().getFullYear();
  }

  public showSlide(slide: any, manualSwitch: boolean = false): void {

    if (manualSwitch && this._runSlideCycle) {
      this.runSlideCycle = true;
    }

    for (let s of this.modules) {
      s.wasPreviouslyShown = s.isShown;
      s.isShown = false;
    }
    slide.isShown = true;
    let scrollEl = $(this.introModulesContentWrapper.nativeElement);
    let slideContentWidth = scrollEl.find('.intro-module')[0].clientWidth;
    let scrollLeftTarget = slideContentWidth * this.currentSlideIndex() - (window.innerWidth - slideContentWidth) / 2;
    scrollEl.stop().animate({scrollLeft: scrollLeftTarget}, 500);

    this.cdRef.detectChanges();

  }

  private currentSlideIndex(): number {
    return this.modules.findIndex(s => s.isShown);
  }

  get selectedSlide(): any {
    return this.modules.find(s => s.isShown);
  }

}
