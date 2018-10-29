import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../services/auth.service';
import {PasswordReset} from '../../../entities/password-reset.entity';

@Component({
  selector: 'ut-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.less', '../project-login.component.less']
})
export class PasswordChangeComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  public changePassword(pwdReset: PasswordReset): void {
    this.authService.changePassword(pwdReset);
  }

}
