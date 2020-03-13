import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActionDirective} from './directives/action.directive';


@NgModule({
  declarations: [
    // Directives
    ActionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Directives
    ActionDirective
  ]
})
export class SharedModule { }
