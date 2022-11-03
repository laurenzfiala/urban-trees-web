import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TreesRoutingModule} from './trees-routing.module';
import {TreesComponent} from './trees.component';
import {HeaderComponent} from './components/header/header.component';
import {HomeComponent} from './components/home/home.component';
import {ObservationComponent} from './components/phenology/observation/observation.component';
import {MissingComponent} from './components/missing/missing.component';
import {ImprintComponent} from './components/imprint/imprint.component';
import {FooterComponent} from './components/footer/footer.component';
import {ReportComponent} from './components/report/report.component';
import {TreeComponent} from './components/tree/tree.component';
import {TreeListComponent} from './components/tree-list/tree-list.component';
import {ProjectLoginComponent} from './components/project-login/project-login.component';
import {PasswordChangeComponent} from './components/project-password-change/project-password-change.component';
import {AudioImgComponent} from './components/audio-img/audio-img.component';
import {AdminComponent} from './components/admin/admin.component';
import {AdminTreeComponent} from './components/admin/tree/tree.component';
import {AdminBeaconComponent} from './components/admin/beacon/beacon.component';
import {AdminBeaconManageComponent} from './components/admin/beacon/manage/manage.component';
import {AdminUserComponent} from './components/admin/user/user.component';
import {MapComponent} from './components/map/map.component';
import {BeaconListComponent} from './components/beacon-list/beacon-list.component';
import {BeaconSelectComponent} from './components/beacon-select/beacon-select.component';
import {TreeSelectComponent} from './components/tree-select/tree-select.component';
import {UsernameChangeComponent} from './components/project-username-change/project-username-change.component';
import {StatisticsComponent} from './components/statistics/statistics.component';
import {MeasurementsComponent} from './components/measurements/measurements.component';
import {SettingsComponent} from './components/settings/settings.component';
import {LoadingStatusComponent} from './components/loading-status/loading-status.component';
import {MessagesComponent} from './components/messages/messages.component';
import {HelpComponent} from './components/help/help.component';
import {SlideshowComponent} from './components/slideshow/slideshow.component';
import {UserPermissionComponent} from './components/user-permission/user-permission.component';
import {AnnouncementsComponent} from './components/admin/announcements/announcements.component';
import {NotificationsComponent} from './components/notifications/notifications.component';
import {StringModificationPipe} from './pipes/strmod.pipe';
import {CapitalizationPipe} from './pipes/capitalize.pipe';
import {LowercasePipe} from './pipes/lowercase.pipe';
import {ReplacePipe} from './pipes/replace.pipe';
import {DecimalPlacesPipe} from './pipes/decimal-places.pipe';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LayoutModule} from '@angular/cdk/layout';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ModalModule} from 'ngx-bootstrap/modal';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {TranslateModule} from '@ngx-translate/core';
import {EnvironmentService} from '../shared/services/environment.service';
import {SubscriptionManagerService} from './services/subscription-manager.service';
import {AnnouncementService} from './services/announcement.service';
import {PhenologyObservationService} from './services/phenology/observation/phenology-observation.service';
import {TreeService} from './services/tree.service';
import {BeaconService} from './services/beacon.service';
import {AdminService} from './services/admin/admin.service';
import {UserService} from './services/user.service';
import {UIService} from './services/ui.service';
import {MessagesService} from './services/messages.service';
import {SearchService} from './services/search.service';
import {NotificationsService} from './services/notifications.service';
import {AuthHelperService} from './services/auth-helper.service';
import {UserRewardService} from './services/user-reward.service';
import {ProjectLoginGuard} from './components/project-login/project-login.guard';
import {AdminGuard} from './components/admin/admin.guard';
import {LayoutConfig} from './config/layout.config';
import {AuthInterceptor} from '../shared/interceptors/auth.interceptor';
import {SharedModule} from '../shared/shared.module';
import {AuthService} from '../shared/services/auth.service';
import {TranslateInitService} from '../shared/services/translate-init.service';
import {OtpManageComponent} from './components/otp-manage/otp-manage.component';
import {OtpScratchCodePipe} from './pipes/otp-scratch-code.pipe';
import {BeacontransferComponent} from './components/beacontransfer/beacontransfer.component';
import {UserProgressComponent} from './components/user-progress/user-progress.component';
import {CmsModule} from '../cms/cms.module';
import {JournalComponent} from './components/journal/journal.component';
import {ExpDaysComponent} from './components/journal/exp-days/exp-days.component';
import {SensorToAppComponent} from './components/journal/sensor-to-app/sensor-to-app.component';
import {AppToAnalyseComponent} from './components/journal/app-to-analyse/app-to-analyse.component';
import {ContentComponent} from './components/admin/content/content.component';
import { JournalViewComponent } from './components/teacher/journal-view/journal-view.component';
import { MethodboxComponent } from './components/methodbox/methodbox.component';
import {ProjectLoginExpiredGuard} from './components/project-login/project-login-expired.guard';
import { PrivacyComponent } from './components/privacy/privacy.component';

@NgModule({
    declarations: [
        // Components
        TreesComponent,
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
        UsernameChangeComponent,
        StatisticsComponent,
        MeasurementsComponent,
        SettingsComponent,
        LoadingStatusComponent,
        MessagesComponent,
        HelpComponent,
        SlideshowComponent,
        UserPermissionComponent,
        AnnouncementsComponent,
        NotificationsComponent,
        OtpManageComponent,
        BeacontransferComponent,
        UserProgressComponent,
        JournalComponent,
        ExpDaysComponent,
        SensorToAppComponent,
        AppToAnalyseComponent,
        JournalViewComponent,
        PrivacyComponent,

        // Pipes
        StringModificationPipe,
        CapitalizationPipe,
        LowercasePipe,
        ReplacePipe,
        DecimalPlacesPipe,
        OtpScratchCodePipe,
        ContentComponent,
        MethodboxComponent
    ],
    imports: [
        // Core
        CommonModule,
        SharedModule,
        TreesRoutingModule,
        FormsModule,
        HttpClientModule,
        LayoutModule,
        CmsModule,

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

        // Translation
        TranslateModule,

        // Charts
        NgxChartsModule
    ],
    exports: [
        ContentComponent
    ],
    providers: [
        // Core services
        AuthService,
        EnvironmentService,
        SubscriptionManagerService,

        // Component-Services
        AnnouncementService,
        PhenologyObservationService,
        TreeService,
        BeaconService,
        AdminService,
        UserService,
        UIService,
        MessagesService,
        SearchService,
        NotificationsService,
        AuthHelperService,
        UserRewardService,
        TranslateInitService,

        // Guards
        ProjectLoginGuard,
        ProjectLoginExpiredGuard,
        AdminGuard,

        // Config classes
        LayoutConfig,

        // Interceptors
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class TreesModule {
  constructor() {
    console.log('Module init');
  }

}
