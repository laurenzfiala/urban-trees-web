import { Component, OnInit } from '@angular/core';
import {EnvironmentService} from "../../services/environment.service";

@Component({
  selector: 'ut-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor(public envService: EnvironmentService) { }

  ngOnInit() {
  }

}
