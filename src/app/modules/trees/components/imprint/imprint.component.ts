import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.less']
})
export class ImprintComponent implements OnInit {

  constructor(public translateService: TranslateService) { }

  ngOnInit() {
  }

}
