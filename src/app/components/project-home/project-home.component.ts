import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'ut-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.less']
})
export class ProjectHomeComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

}
