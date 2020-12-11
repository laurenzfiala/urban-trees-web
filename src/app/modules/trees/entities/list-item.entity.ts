/**
 * Holds a single list item to be shown in
 * ListComponent.
 *
 * @author Laurenz Fiala
 * @since 2020/11/12
 */
import {TemplateRef} from '@angular/core';

export class ListItem {

  public key: any;
  public category: TemplateRef<any>;

  constructor(key: any, category: TemplateRef<any>) {
    this.key = key;
    this.category = category;
  }

}
