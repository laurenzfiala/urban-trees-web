import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.less']
})
export class PrivacyComponent implements OnInit {

  constructor(public translateService: TranslateService) { }

  ngOnInit(): void {
  }

}
