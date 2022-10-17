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
import {JournalComponent} from './components/journal/journal.component';
import {ContentComponent} from './components/admin/content/content.component';
import {JournalViewComponent} from './components/teacher/journal-view/journal-view.component';
import {MethodboxComponent} from './components/methodbox/methodbox.component';
import {ProjectLoginExpiredGuard} from './components/project-login/project-login-expired.guard';
import {PrivacyComponent} from './components/privacy/privacy.component';

const routes: Routes = [
  {
    path: 'beacontransfer/:beaconId',
    component: BeacontransferComponent
  },
  {
    path: '',
    component: TreesComponent,
    canActivateChild: [ProjectLoginExpiredGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.user
        }
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
        path: 'privacy',
        component: PrivacyComponent
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
        path: 'login',
        component: ProjectLoginComponent,
      },
      {
        path: 'login/:token',
        component: ProjectLoginComponent
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
          roles: [...environment.security.roles.user, environment.security.roles.tempActivateOTP]
        }
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [ProjectLoginGuard, AdminGuard],
        data: {roles: [...environment.security.roles.admin, ...environment.security.roles.adminLocked]}
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
      {// Note: if messages are implemented in the future, redirect from /admin/report to e.g. /messages and use same comp
        path: 'admin/content',
        component: ContentComponent,
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
        data: {showAuthTimeout: true}
      },
      {
        path: 'methodbox',
        component: MethodboxComponent,
        canActivate: [ProjectLoginGuard],
        canActivateChild: [ProjectLoginGuard],
        data: {
          roles: [...environment.security.roles.teacher, ...environment.security.roles.admin],
          showAuthTimeout: true
        }
      },
      {
        path: 'journal',
        component: JournalComponent,
        canActivate: [ProjectLoginGuard],
        canActivateChild: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.journal,
          showAuthTimeout: true
        }
      },
      {
        path: 'teacher/journal',
        component: JournalViewComponent,
        canActivate: [ProjectLoginGuard],
        canActivateChild: [ProjectLoginGuard],
        data: {
          roles: environment.security.roles.teacher,
          showAuthTimeout: true
        }
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
