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
import {PasswordChangeComponent} from './components/project-login/password-change/password-change.component';

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
    path: 'account/changepassword',
    component: PasswordChangeComponent,
    canActivate: [ProjectLoginGuard]
  },
  {
    path: 'project',
    component: ProjectHomeComponent,
    canActivate: [ProjectLoginGuard]//,
    //data: {roles: environment.security.roles.phenObs}
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
