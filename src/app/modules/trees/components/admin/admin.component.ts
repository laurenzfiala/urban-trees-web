import { Component, OnInit } from '@angular/core';
import {UserData} from '../../entities/user-data.entity';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'ut-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  get userdata(): UserData {
    return this.userService.getUserData();
  }

}
