import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../shared/interceptors/auth.interceptor';
import {TextComponent} from './cms-components/text/text.component';
import {ContentComponent} from './components/content/content.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TranslateInitService} from '../shared/services/translate-init.service';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../shared/shared.module';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import {BlockLayout} from './cms-layouts/block-layout/block-layout.component';
import {SerializationService} from './services/serialization.service';
import {TwoColumnLayout} from './cms-layouts/two-column-layout/two-column-layout.component';
import {ContentSaveStatusComponent} from './components/content-save-status/content-save-status.component';
import {FileComponent} from './cms-components/file/file.component';
import {ImageComponent} from './cms-components/image/image.component';
import {ContentManagerComponent} from './components/content-manager/content-manager.component';
import {CollapseModule} from 'ngx-bootstrap/collapse';
import {ExpDaysLayout} from './cms-layouts/exp-days/exp-days.component';
import {SensorToAppLayout} from './cms-layouts/sensor-to-app/sensor-to-app.component';
import { ContentToolbarComponent } from './components/content-toolbar/content-toolbar.component';
import { EditLayoutDropzoneComponent } from './components/edit-layout-dropzone/edit-layout-dropzone.component';
import { EditLayoutComponent } from './components/edit-layout/edit-layout.component';

@NgModule({
  declarations: [
    // Components
    ContentComponent,
    ContentSaveStatusComponent,
    ContentManagerComponent,

    // Directives

    // CMS Components
    TextComponent,
    FileComponent,
    ImageComponent,

    // CMS Layouts
    BlockLayout,
    TwoColumnLayout,
    ExpDaysLayout,
    SensorToAppLayout,
    ContentToolbarComponent,
    EditLayoutDropzoneComponent,
    EditLayoutComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,

    // Ngx-Bootstrap
    PopoverModule,
    TooltipModule,
    BsDropdownModule,
    FormsModule,

    // Translation
    TranslateModule,
    CollapseModule
  ],
  providers: [
    // Services
    TranslateInitService,
    SerializationService,

    // Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  exports: [
    // Components
    ContentComponent,
    FileComponent,
    ImageComponent,
    ContentManagerComponent,
    ExpDaysLayout,
    SensorToAppLayout
  ]
})
export class CmsModule { }
