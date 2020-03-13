import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ut-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {

  public moduleSlides: any = [
    {
      imageUrl: '/assets/landing-page/modules/module1.jpg',
      text: 'This should describe what\'s going on in the picture.'
    },
    {
      imageUrl: '/assets/landing-page/modules/module2.jpg',
      text: 'This should describe what\'s going on in the picture. (2)'
    },
    {
      imageUrl: '/assets/landing-page/modules/module3.jpg',
      text: 'This should describe what\'s going on in the picture. (3)'
    }
  ];

  constructor() { }

  public ngOnInit(): void {

    this.showSlide(this.moduleSlides[0]);

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
