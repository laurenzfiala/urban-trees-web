import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {AInfoComponent} from './components/phenology/observation/a-info/a-info.component';
import {BObservationComponent} from './components/phenology/observation/b-observation/b-observation.component';
import {CUploadComponent} from './components/phenology/observation/c-upload/c-upload.component';
import {DFinishComponent} from './components/phenology/observation/d-finish/d-finish.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {MissingComponent} from './components/missing/missing.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {
  PhenologyObservationStepGuard
} from './components/phenology/observation/phenology-observation-step.guard';
import {TreeComponent} from './components/tree/tree.component';
import {TreeListComponent} from './components/tree-list/tree-list.component';
import {ProjectHomeComponent} from './components/project-home/project-home.component';
import {ProjectLoginComponent} from './components/project-login/project-login.component';
import {ProjectLoginGuard} from './components/project-login/project-login.guard';
import {AdminComponent} from './components/admin/admin.component';
import {environment} from '../environments/environment';
import {AdminTreeComponent} from './components/admin/tree/tree.component';
import {AdminBeaconComponent} from './components/admin/beacon/beacon.component';
import {AdminUserComponent} from './components/admin/user/user.component';
import {UsernameChangeComponent} from './components/project-username-change/project-username-change.component';
import {PasswordChangeComponent} from './components/project-password-change/project-password-change.component';
import {ProjectLoginKeyComponent} from './components/project-login-key/project-login-key.component';
import {AnnouncementsComponent} from './components/admin/announcements/announcements.component';
import {AdminGuard} from './components/admin/admin.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
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
    path: 'trees',
    component: TreeListComponent,
  },
  {
    path: 'tree/:treeId',
    component: TreeComponent,
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
    data: {roles: [...environment.security.roles.user, environment.security.roles.tempChangePassword]}
  },
  {
    path: 'account/changeusername',
    component: UsernameChangeComponent,
    canActivate: [ProjectLoginGuard],
    data: {roles: environment.security.roles.user}
  },
  {
    path: 'project',
    component: ProjectHomeComponent,
    canActivate: [ProjectLoginGuard]//,
    //data: {roles: environment.security.roles.phenObs}
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
    data: {roles: environment.security.roles.admin}
  },
  {
    path: 'admin/beacon',
    component: AdminBeaconComponent,
    canActivate: [ProjectLoginGuard, AdminGuard],
    data: {roles: environment.security.roles.admin}
  },
  {
    path: 'admin/user',
    component: AdminUserComponent,
    canActivate: [ProjectLoginGuard, AdminGuard],
    data: {roles: environment.security.roles.admin}
  },
  {
    path: 'admin/announcements',
    component: AnnouncementsComponent,
    canActivate: [ProjectLoginGuard, AdminGuard],
    data: {roles: environment.security.roles.admin}
  },
  {
    path: 'phenology',
    redirectTo: 'project/phenology'
  },
  {
    path: 'project/phenology/observation/step',
    component: ObservationComponent,
    canActivate: [ProjectLoginGuard],
    canActivateChild: [ProjectLoginGuard, PhenologyObservationStepGuard],
    children: [
      {
        path: '',
        redirectTo: '1',
        pathMatch: 'full'
      },
      {
        path: '1',
        component: AInfoComponent
      },
      {
        path: '2',
        component: BObservationComponent
      },
      {
        path: '3',
        component: CUploadComponent
      },
      {
        path: '4',
        component: DFinishComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'missing'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
