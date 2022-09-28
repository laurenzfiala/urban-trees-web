import { Component, OnInit } from '@angular/core';
import {UserData} from '../../entities/user-data.entity';
import {UserService} from '../../services/user.service';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  constructor(private userService: UserService,
              public envService: EnvironmentService) { }

  ngOnInit() {
  }

  get userdata(): UserData {
    return this.userService.getUserData();
  }

}
