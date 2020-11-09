import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {TreesComponent} from './trees.component';
import {HomeComponent} from './components/home/home.component';
import {MissingComponent} from './components/missing/missing.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {SettingsComponent} from './components/settings/settings.component';
import {MeasurementsComponent} from './components/measurements/measurements.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {TreeListComponent} from './components/tree-list/tree-list.component';
import {TreeComponent} from './components/tree/tree.component';
import {ProjectLoginComponent} from './components/project-login/project-login.component';
import {ProjectLoginKeyComponent} from './components/project-login-key/project-login-key.component';
import {PasswordChangeComponent} from './components/project-password-change/project-password-change.component';
import {ProjectLoginGuard} from './components/project-login/project-login.guard';
import {environment} from '../../../environments/environment';
import {UsernameChangeComponent} from './components/project-username-change/project-username-change.component';
import {AdminComponent} from './components/admin/admin.component';
import {AdminGuard} from './components/admin/admin.guard';
import {AdminTreeComponent} from './components/admin/tree/tree.component';
import {AdminBeaconComponent} from './components/admin/beacon/beacon.component';
import {AdminBeaconManageComponent} from './components/admin/beacon/manage/manage.component';
import {AdminUserComponent} from './components/admin/user/user.component';
import {AnnouncementsComponent} from './components/admin/announcements/announcements.component';
import {MessagesComponent} from './components/messages/messages.component';
import {ReportComponent} from './components/report/report.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {HelpComponent} from './components/help/help.component';
import {OtpManageComponent} from './components/otp-manage/otp-manage.component';
import {BeacontransferComponent} from './components/beacontransfer/beacontransfer.component';

const routes: Routes = [
  {
    path: '',
    component: TreesComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'missing',
        component: MissingComponent
      },
      {
        path: 'imprint',
        component: ImprintComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      },
      {
        path: 'measurements',
        component: MeasurementsComponent
      },
      {
        path: 'statistics',
        component: StatisticsComponent
      },
      {
        path: 'trees',
        component: TreeListComponent
      },
      {
        path: 'tree/:treeId',
        component: TreeComponent
      },
      {
        path: 'beacontransfer/:beaconId/:transferStatus',
        component: BeacontransferComponent
      },
      {
        path: 'login',
        component: ProjectLoginComponent
      },
      {
        path: 'login/:token',
        component: ProjectLoginKeyComponent
      },
      {
        path: 'account/changepassword',
        component: PasswordChangeComponent,
        canActivate: [ProjectLoginGuard],
        data: {
          roles: [...environment.security.roles.user, environment.security.roles.tempChangePassword]
        }
      },
      {
        path: 'account/changeusername',
        component: UsernameChangeComponent,
        canActivate: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.user
        }
      },
      {
        path: 'account/2fa',
        component: OtpManageComponent,
        canActivate: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.user
        }
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {roles: environment.security.roles.admin}
      },
      {
        path: 'admin/tree',
        component: AdminTreeComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {
        path: 'admin/beacon',
        component: AdminBeaconComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {
        path: 'admin/beacon/manage',
        component: AdminBeaconManageComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {
        path: 'admin/user',
        component: AdminUserComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {
        path: 'admin/announcements',
        component: AnnouncementsComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {// Note: if messages are implemented in the future, redirect from /admin/report to e.g. /messages and use same comp
        path: 'admin/report',
        component: MessagesComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {
          roles: environment.security.roles.admin,
          showAuthTimeout: true
        }
      },
      {
        path: 'report',
        component: ReportComponent,
        canActivate: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.user,
          showAuthTimeout: true
        }
      },
      {
        path: 'phenology',
        redirectTo: 'project/phenology'
      },
      {
        path: 'project/phenology',
        component: ObservationComponent,
        canActivate: [ProjectLoginGuard],
        canActivateChild: [ProjectLoginGuard],
        data: {showAuthTimeout: true},
        children: [
          { // Note: redirect old URLs ../observation[[/step]/x]
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: 'help',
        component: HelpComponent,
        children: [
          {
            path: '**',
            redirectTo: ''
          }
        ]
      },
      {
        path: '**',
        redirectTo: 'missing'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreesRoutingModule { }
