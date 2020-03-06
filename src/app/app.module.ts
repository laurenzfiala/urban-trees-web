import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {PhenologyObservationService} from './modules/trees/services/phenology/observation/phenology-observation.service';
import {EnvironmentService} from './modules/trees/services/environment.service';
import {SubscriptionManagerService} from './modules/trees/services/subscription-manager.service';
import {AnnouncementService} from './modules/trees/services/announcement.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AuthInterceptor} from './modules/trees/interceptors/auth.interceptor';
import {AuthService} from './modules/trees/services/auth.service';
import {ProjectLoginGuard} from './modules/trees/components/project-login/project-login.guard';
import {TreeService} from './modules/trees/services/tree.service';
import {AdminService} from './modules/trees/services/admin/admin.service';
import {UserService} from './modules/trees/services/user.service';
import {AdminGuard} from './modules/trees/components/admin/admin.guard';
import {UIService} from './modules/trees/services/ui.service';
import {BeaconService} from './modules/trees/services/beacon.service';
import {MessagesService} from './modules/trees/services/messages.service';
import {SearchService} from './modules/trees/services/search.service';
import {LayoutModule} from '@angular/cdk/layout';
import {LayoutConfig} from './modules/trees/config/layout.config';
import {NotificationsService} from './modules/trees/services/notifications.service';
import {AuthHelperService} from './modules/trees/services/auth-helper.service';
import {UserRewardService} from './modules/trees/services/user-reward.service';
import {VERSION} from '../environments/version';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/translations/', '.json?version=' + VERSION.version);
}

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent
  ],
  imports: [
    // Core
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    LayoutModule,

    // Translation
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    TranslateModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
