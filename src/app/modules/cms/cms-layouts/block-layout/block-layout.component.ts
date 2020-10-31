import {Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {CmsLayout} from '../../interfaces/cms-layout.interface';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less']
})
export class LayoutBlockComponent implements OnInit, CmsLayout {

  @ViewChild('slot', {read: ViewContainerRef})
  public slot: ViewContainerRef;

  constructor() { }

  public ngOnInit(): void {
  }

  public deserialize(serialized: any): void {
    const state = serialized;
    this.text = state.text;
  }

  public serialize(): any {
    return {
      text: this.text
    };
  }

  public getName(): string {
    return this.constructor.name;
  }

}
