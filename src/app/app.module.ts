import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {AInfoComponent} from './components/phenology/observation/a-info/a-info.component';
import {BObservationComponent} from './components/phenology/observation/b-observation/b-observation.component';
import {CUploadComponent} from './components/phenology/observation/c-upload/c-upload.component';
import {DFinishComponent} from './components/phenology/observation/d-finish/d-finish.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {FormsModule} from '@angular/forms';
import {StringModificationPipe} from './pipes/strmod.pipe';
import {CapitalizationPipe} from './pipes/capitalize.pipe';
import {LowercasePipe} from './pipes/lowercase.pipe';
import {
  BsDatepickerModule,
  BsDropdownModule,
  ButtonsModule,
  CollapseModule,
  PopoverModule, TabsModule,
  TimepickerModule
} from 'ngx-bootstrap';
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
import { TreeComponent } from './components/tree/tree.component';
import { TreeListComponent } from './components/tree-list/tree-list.component';
import { SpyDirective } from './directives/spy.directive';
import { ProjectHomeComponent } from './components/project-home/project-home.component';
import { ProjectLoginComponent } from './components/project-login/project-login.component';
import {AuthInterceptor} from './interceptors/auth.interceptor';
import {PhenologyObservationStepGuard} from './components/phenology/observation/phenology-observation-step.guard';
import {AuthService} from './services/auth.service';
import {ProjectLoginGuard} from './components/project-login/project-login.guard';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TreeService} from './services/tree.service';
import { DecimalPlacesPipe } from './pipes/decimal-places.pipe';
import {AuthDirective} from './directives/auth.directive';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import {ProjectPasswordResetComponent} from './components/project-password-reset/project-password-reset.component';
import { PasswordChangeComponent } from './components/project-login/password-change/password-change.component';
import {AudioImgComponent} from './components/audio-img/audio-img.component';
import {NoAuthDirective} from "./directives/noauth.directive";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/translations/');
}

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AInfoComponent,
    BObservationComponent,
    CUploadComponent,
    DFinishComponent,
    ObservationComponent,
    MissingComponent,
    ImprintComponent,
    FooterComponent,
    ReportComponent,
    TreeComponent,
    TreeListComponent,
    ProjectHomeComponent,
    ProjectLoginComponent,
    ProjectPasswordResetComponent,
    PasswordChangeComponent,
    AudioImgComponent,

    // Directives
    SpyDirective,
    AuthDirective,
    NoAuthDirective,

    // Pipes
    StringModificationPipe,
    CapitalizationPipe,
    LowercasePipe,
    DecimalPlacesPipe,
    TextEditorComponent
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
    TimepickerModule.forRoot(),
    ButtonsModule.forRoot(),
    PopoverModule.forRoot(),
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
    // Native providers
    {provide: Window, useValue: window},

    // Core services
    EnvironmentService,
    SubscriptionManagerService,
    AnnouncementService,
    AuthService,

    // Component-Services
    PhenologyObservationService,
    TreeService,

    // Guards
    PhenologyObservationStepGuard,
    ProjectLoginGuard,

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
