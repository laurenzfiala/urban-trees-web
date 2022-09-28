import { Component, OnInit } from '@angular/core';
import {ContentService} from '../../services/content.service';

@Component({
  selector: 'ut-contents',
  templateUrl: './contents.component.html',
  styleUrls: ['./contents.component.less'],
  providers: [ContentService]
})
export class ContentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
