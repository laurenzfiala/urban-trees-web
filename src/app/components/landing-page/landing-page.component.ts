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

  public loading: boolean = false;

  @ViewChild('introTabsContentWrapper')
  public introTabsContentWrapper: ElementRef;

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
      iconUrl: '/assets/landing-page/icons/experimentieren.svg',
      title: 'Experimentieren',
      imageUrl: '/assets/landing-page/intro-slides/experimentieren.jpg',
      bgColor: '#18628D',
      imgDesc: 'Wir führen spannende Experimente durch.'
    },
    {
      iconUrl: '/assets/landing-page/icons/programmieren.svg',
      title: 'Programmieren',
      imageUrl: '/assets/landing-page/intro-slides/programmieren.jpg',
      bgColor: '#14A3A2',
      imgDesc: 'Wir programmieren Schaltkreise & Sensoren.'
    },
    {
      iconUrl: '/assets/landing-page/icons/messen.svg',
      title: 'Messen',
      imageUrl: '/assets/landing-page/intro-slides/messen.jpg',
      bgColor: '#0E9960',
      imgDesc: 'Wir messen Temperatur & CO₂-Gehalt der Luft.'
    },
    {
      iconUrl: '/assets/landing-page/icons/analysieren.svg',
      title: 'Analysieren',
      imageUrl: '/assets/landing-page/intro-slides/analysieren_2.jpg',
      bgColor: '#079725',
      imgDesc: 'Wir analysieren die gemessenen Daten.'
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
    let scrollEl = $(this.introTabsContentWrapper.nativeElement);
    const slideTabWidth = scrollEl.find('.intro-tab')[this.currentSlideIndex()].clientWidth;
    let slideTabTargetOffset = 0;
    for (let tab of scrollEl.find('.intro-tab').slice(0, this.currentSlideIndex())) {
      slideTabTargetOffset += tab.clientWidth;
    }
    let scrollLeftTarget = slideTabTargetOffset - (window.innerWidth - slideTabWidth) / 2;
    scrollEl.stop().animate({scrollLeft: scrollLeftTarget}, 500);

    this.cdRef.detectChanges();

  }

  private currentSlideIndex(): number {
    return this.modules.findIndex(s => s.isShown);
  }

  get selectedSlide(): any {
    return this.modules.find(s => s.isShown);
  }

  public loadPage(event: any) {
    const element = event.target;
    element.classList.add('loading');
  }

}
