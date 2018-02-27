import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'ut-phenology',
  templateUrl: './phenology.component.html',
  styleUrls: ['./phenology.component.less']
})
export class PhenologyComponent implements OnInit {

  constructor(public router: Router) {}

  public ngOnInit(): void {

  }

}
