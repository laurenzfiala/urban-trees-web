import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {PhenologyComponent} from './components/phenology/phenology.component';
import {AInfoComponent} from './components/phenology/observation/a-info/a-info.component';
import {BObservationComponent} from './components/phenology/observation/b-observation/b-observation.component';
import {CUploadComponent} from './components/phenology/observation/c-upload/c-upload.component';
import {DFinishComponent} from './components/phenology/observation/d-finish/d-finish.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {FormsModule} from '@angular/forms';
import {StringModificationPipe} from './pipes/strmod.pipe';
import {CapitalizationPipe} from './pipes/capitalize.pipe';
import {LowercasePipe} from './pipes/lowercase.pipe';
import {BsDatepickerModule, BsDropdownModule, ButtonsModule, PopoverModule, TimepickerModule} from 'ngx-bootstrap';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {PhenologyObservationService} from './services/phenology/observation/phenology-observation.service';
import {EnvironmentService} from './services/environment.service';
import {SubscriptionManagerService} from './services/subscription-manager.service';
import {MissingComponent} from './components/missing/missing.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {FooterComponent} from './components/footer/footer.component';
import {AnnouncementService} from './services/announcement.service';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {PhenologyObservationStepGuard} from './components/phenology/observation/phenology-observation-step.guard';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/translations/');
}

@NgModule({
  declarations: [
    // Components
    AppComponent,
    HeaderComponent,
    PhenologyComponent,
    HomeComponent,
    AInfoComponent,
    BObservationComponent,
    CUploadComponent,
    DFinishComponent,
    ObservationComponent,
    MissingComponent,
    ImprintComponent,
    FooterComponent,

    // Pipes
    StringModificationPipe,
    CapitalizationPipe,
    LowercasePipe
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

    // Component-Services
    PhenologyObservationService,
    PhenologyObservationStepGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
