import {Component, Input, OnInit} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {CmsComponent} from '../../interfaces/cms-component.interface';
import {ToolbarBtn, ToolbarDropdown, ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';

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

  getToolbarSection(): ToolbarSection<ToolbarBtn> {
    return new ToolbarSection<ToolbarBtn>(
      new ToolbarBtn('Test name', 'Test description', '/assets/img/icon/dark/edit.svg')
    );
  }

  getToolbarContextual(): ToolbarSection<ToolbarElement> {
    return new ToolbarSection<ToolbarElement>(
      new ToolbarDropdown('Test name', '1', new Map<string, any>(
        [
          ['1', 'Value 1'],
          ['2', 'Value 2']
        ]
      ))
    );
  }

}
