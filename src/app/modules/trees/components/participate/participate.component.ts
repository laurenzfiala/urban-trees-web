import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ut-csa',
  templateUrl: './participate.component.html',
  styleUrls: ['./participate.component.less']
})
export class ParticipateComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

  public scrollIntoView(el: any): void {
    el.scrollIntoView();
  }

}
