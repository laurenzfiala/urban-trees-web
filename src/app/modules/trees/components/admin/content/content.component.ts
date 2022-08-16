import { Component, OnInit } from '@angular/core';
import { ContentManagerMode } from '../../../../cms/components/content-manager/content-manager.component';

@Component({
  selector: 'ut-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less']
})
export class ContentComponent implements OnInit {

  ContentManagerMode = ContentManagerMode;

  constructor() { }

  ngOnInit(): void {
  }

}
