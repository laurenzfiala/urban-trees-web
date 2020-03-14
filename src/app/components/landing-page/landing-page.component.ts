import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ut-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {

  public runSlideCycle: boolean = false;

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

    this.showSlide(this.moduleSlides[0]);
    this.startSlideCycle();

  }

  private startSlideCycle(): void {

    setInterval(() => {
      if (!this.runSlideCycle) {
        return;
      }
      let nextSlide = this.moduleSlides.findIndex(s => s.isShown) + 1;
      if (nextSlide >= this.moduleSlides.length) {
        nextSlide = 0;
      }
      this.showSlide(this.moduleSlides[nextSlide]);
    }, 5000);

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

  }

  get selectedSlide(): any {
    return this.moduleSlides.find(s => s.isShown);
  }

}
