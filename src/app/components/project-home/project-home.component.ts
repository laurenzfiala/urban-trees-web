import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {EnvironmentService} from '../../services/environment.service';

@Component({
  selector: 'ut-project-home',
  templateUrl: './project-home.component.html',
  styleUrls: ['./project-home.component.less']
})
export class ProjectHomeComponent implements OnInit {

  constructor(public authService: AuthService,
              public envService: EnvironmentService) { }

  ngOnInit() {
  }

}
