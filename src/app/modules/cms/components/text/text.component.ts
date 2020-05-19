import {Component, Input, OnInit} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {CmsComponent} from '../../interfaces/cms-component.inerface';

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

  public deserialize(serialized: string): void {
    const state = this.serializationService.deserializeComponentState(serialized);
    this.text = state.text;
  }

  public serialize(): string {
    return this.serializationService.serializeComponentState(
      {
        text: this.text
      }
    );
  }

}
