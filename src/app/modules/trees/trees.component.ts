import { Component, OnInit } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.less']
})
export class TreesComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  public ngOnInit(): void {
  }

}
