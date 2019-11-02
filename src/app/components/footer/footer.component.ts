import { Component, OnInit } from '@angular/core';
import {VERSION} from '../../../environments/version';

@Component({
  selector: 'ut-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent implements OnInit {

  public version = VERSION;

  constructor() { }

  ngOnInit() {
  }

}
