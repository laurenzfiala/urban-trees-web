import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from '../shared/interceptors/auth.interceptor';
import {TextComponent} from './cms-components/text/text.component';
import {ContentComponent} from './components/content/content.component';
import {ForNDirective} from './directives/for-n.directive';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {TranslateInitService} from '../shared/services/translate-init.service';
import {TranslateModule} from '@ngx-translate/core';
import {SharedModule} from '../shared/shared.module';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from '@angular/forms';
import {BlockLayout} from './cms-layouts/block-layout/block-layout.component';
import {SerializationService} from './services/serialization.service';

@NgModule({
  declarations: [
    // Components
    ContentComponent,
    TextComponent,
    BlockLayout,

    // Directives
    ForNDirective
  ],
  imports: [
    CommonModule,
    SharedModule,
    TooltipModule,
    TranslateModule,

    // Ngx-Bootstrap
    PopoverModule,
    TooltipModule,
    BsDropdownModule,
    FormsModule
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
    ContentComponent
    // TODO
  ]
})
export class CmsModule { }
