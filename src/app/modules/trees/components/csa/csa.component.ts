import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ut-csa',
  templateUrl: './csa.component.html',
  styleUrls: ['./csa.component.less']
})
export class CsaComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
  }

  public scrollIntoView(el: any): void {
    el.scrollIntoView();
  }

}
