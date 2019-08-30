import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TranslateCompiler, TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {FormsModule} from '@angular/forms';
import {StringModificationPipe} from './pipes/strmod.pipe';
import {CapitalizationPipe} from './pipes/capitalize.pipe';
import {LowercasePipe} from './pipes/lowercase.pipe';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ModalModule} from 'ngx-bootstrap/modal';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {PhenologyObservationService} from './services/phenology/observation/phenology-observation.service';
import {EnvironmentService} from './services/environment.service';
import {SubscriptionManagerService} from './services/subscription-manager.service';
import {MissingComponent} from './components/missing/missing.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {FooterComponent} from './components/footer/footer.component';
import {AnnouncementService} from './services/announcement.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ReportComponent} from './components/report/report.component';
import {TreeComponent} from './components/tree/tree.component';
import {TreeListComponent} from './components/tree-list/tree-list.component';
import {SpyDirective} from './directives/spy.directive';
import {ProjectLoginComponent} from './components/project-login/project-login.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {AuthService} from './services/auth.service';
import {ProjectLoginGuard} from './components/project-login/project-login.guard';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TreeService} from './services/tree.service';
import {DecimalPlacesPipe} from './pipes/decimal-places.pipe';
import {AuthDirective} from './directives/auth.directive';
import {AudioImgComponent} from './components/audio-img/audio-img.component';
import {NoAuthDirective} from './directives/noauth.directive';
import {AdminComponent} from './components/admin/admin.component';
import {AdminBeaconComponent} from './components/admin/beacon/beacon.component';
import {AdminUserComponent} from './components/admin/user/user.component';
import {MapComponent} from './components/map/map.component';
import {AdminTreeComponent} from './components/admin/tree/tree.component';
import {AdminService} from './services/admin/admin.service';
import {BeaconListComponent} from './components/beacon-list/beacon-list.component';
import {TreeSelectComponent} from './components/tree-select/tree-select.component';
import {UserOverviewComponent} from './components/user-overview/user-overview.component';
import {UserService} from './services/user.service';
import {UsernameChangeComponent} from './components/project-username-change/project-username-change.component';
import {PasswordChangeComponent} from './components/project-password-change/project-password-change.component';
import {ProjectLoginKeyComponent} from './components/project-login-key/project-login-key.component';
import {AnnouncementsComponent} from './components/admin/announcements/announcements.component';
import {CheckDirective} from './directives/check.directive';
import {ValueaccessorDirective} from './directives/valueaccessor.directive';
import {AdminGuard} from './components/admin/admin.guard';
import {CssVariableDirective} from './directives/css-variable.directive';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { MeasurementsComponent } from './components/measurements/measurements.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ZoomComponent } from './components/zoom/zoom.component';
import {UIService} from './services/ui.service';
import {BeaconService} from './services/beacon.service';
import { LoadingStatusComponent } from './components/loading-status/loading-status.component';
import { SlideshowComponent } from './components/slideshow/slideshow.component';
import { MessagesComponent } from './components/messages/messages.component';
import {MessagesService} from './services/messages.service';
import { UserPermissionComponent } from './components/user-permission/user-permission.component';
import {BeaconSelectComponent} from './components/beacon-select/beacon-select.component';
import {AdminBeaconManageComponent} from './components/admin/beacon/manage/manage.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/translations/', '.json?cacheBust=' + new Date().getTime());
}

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HeaderComponent,
    HomeComponent,
    ObservationComponent,
    MissingComponent,
    ImprintComponent,
    FooterComponent,
    ReportComponent,
    TreeComponent,
    TreeListComponent,
    ProjectLoginComponent,
    PasswordChangeComponent,
    AudioImgComponent,
    AdminComponent,
    AdminTreeComponent,
    AdminBeaconComponent,
    AdminBeaconManageComponent,
    AdminUserComponent,
    MapComponent,
    BeaconListComponent,
    BeaconSelectComponent,
    TreeSelectComponent,
    UserOverviewComponent,
    UsernameChangeComponent,
    ProjectLoginKeyComponent,
    StatisticsComponent,
    MeasurementsComponent,
    SettingsComponent,
    ZoomComponent,
    LoadingStatusComponent,
    MessagesComponent,

    // Directives
    SpyDirective,
    AuthDirective,
    NoAuthDirective,
    CheckDirective,
    CssVariableDirective,

    // Pipes
    StringModificationPipe,
    CapitalizationPipe,
    LowercasePipe,
    DecimalPlacesPipe,
    AnnouncementsComponent,
    ValueaccessorDirective,
    SlideshowComponent,
    UserPermissionComponent
  ],
  imports: [
    // Core
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,

    // Ngx-Bootstrap
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
    TimepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    TabsModule.forRoot(),

    // Charts
    NgxChartsModule,

    // Translation
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    // Core services
    EnvironmentService,
    SubscriptionManagerService,
    AnnouncementService,
    AuthService,

    // Component-Services
    PhenologyObservationService,
    TreeService,
    BeaconService,
    AdminService,
    UserService,
    UIService,
    MessagesService,

    // Guards
    ProjectLoginGuard,
    AdminGuard,

    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
