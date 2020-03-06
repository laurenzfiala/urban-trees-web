import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./modules/trees/trees.module').then(m => m.TreesModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,
    {
      anchorScrolling: 'enabled'
    }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
