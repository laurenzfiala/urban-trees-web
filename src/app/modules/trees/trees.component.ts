import {Component, OnInit} from '@angular/core';
import {TranslateInitService} from '../shared/services/translate-init.service';

@Component({
  selector: 'ut-trees',
  templateUrl: './trees.component.html',
  styleUrls: ['./trees.component.less']
})
export class TreesComponent implements OnInit {

  constructor(private translateInit: TranslateInitService) { }

  public ngOnInit(): void {
    this.translateInit.onModuleInit();
  }

}
