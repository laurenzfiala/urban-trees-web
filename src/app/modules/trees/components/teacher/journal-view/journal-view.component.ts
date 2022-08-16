import { Component, OnInit } from '@angular/core';
import {ContentManagerMode} from '../../../../cms/components/content-manager/content-manager.component';

@Component({
  selector: 'ut-journal-view',
  templateUrl: './journal-view.component.html',
  styleUrls: ['./journal-view.component.less']
})
export class JournalViewComponent implements OnInit {

  ContentManagerMode = ContentManagerMode;

  constructor() { }

  ngOnInit(): void {
  }

}
