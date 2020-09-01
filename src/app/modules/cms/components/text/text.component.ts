import {Component, Input, OnInit} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {CmsComponent} from '../../interfaces/cms-component.interface';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less']
})
export class TextComponent implements OnInit, CmsComponent {

  @Input()
  public text: string;

  constructor(private serializationService: SerializationService) { }

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

  public getComponentName(): string {
    return this.constructor.name;
  }

}
