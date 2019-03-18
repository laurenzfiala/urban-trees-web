import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Login} from '../../entities/login.entity';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'ut-project-login-key',
  templateUrl: './project-login-key.component.html',
  styleUrls: ['./project-login-key.component.less']
})
export class ProjectLoginKeyComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  private static PATH_PARAMS_TOKEN = 'token';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.LOGIN, StatusValue.IN_PROGRESS);

    this.route.params.subscribe((params: any) => {

      const token: string = params[ProjectLoginKeyComponent.PATH_PARAMS_TOKEN];

      let loginEntity = new Login(undefined, undefined, token);

      this.authService.login(loginEntity, () => {
        this.setStatus(StatusKey.LOGIN, StatusValue.SUCCESSFUL);

        setTimeout(() => {

          let redirectTo = '/project';
          if (this.authService.isTempChangePasswordAuth()) {
            redirectTo = '/account/changepassword';
          }
          this.router.navigate([redirectTo]);

        }, 1500);


      }, (error, apiError) => {
        this.setStatus(StatusKey.LOGIN, StatusValue.FAILED);
      });

    });

  }

}

export enum StatusKey {

  LOGIN

}

export enum StatusValue {

  PENDING,
  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}