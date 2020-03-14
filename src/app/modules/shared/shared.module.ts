import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActionDirective} from './directives/action.directive';
import {CssVariableDirective} from './directives/css-variable.directive';


@NgModule({
  declarations: [
    // Directives
    ActionDirective,
    CssVariableDirective
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
