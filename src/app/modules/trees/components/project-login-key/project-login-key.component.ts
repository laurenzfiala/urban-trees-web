import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../abstract.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TokenAuthenticationToken} from '../../entities/auth-token.entity';

@Component({
  selector: 'ut-project-login-key',
  templateUrl: './project-login-key.component.html',
  styleUrls: ['./project-login-key.component.less']
})
export class ProjectLoginKeyComponent extends AbstractComponent implements OnInit {

  private static PATH_PARAMS_TOKEN = 'token';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
    super();
  }

  public ngOnInit(): void {

    this.setStatus(StatusKey.LOGIN, StatusValue.IN_PROGRESS);

    this.route.params.subscribe((params: any) => {

      const token: string = params[ProjectLoginKeyComponent.PATH_PARAMS_TOKEN];

      let loginEntity = new TokenAuthenticationToken(token);

      this.authService.login(loginEntity, () => {
        this.setStatus(StatusKey.LOGIN, StatusValue.SUCCESSFUL);

        setTimeout(() => {
          this.router.navigate([this.authService.getRedirectAfterLogin('/home')]);
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
