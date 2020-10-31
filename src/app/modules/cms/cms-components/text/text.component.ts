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

  public getName(): string {
    return this.constructor.name;
  }

  getToolbarSection(): ToolbarSection<ToolbarBtn> {
    return new ToolbarSection<ToolbarBtn>(
      new ToolbarBtn(
        'New text passage',
        'Add a new text passage to the content',
        '/assets/img/icon/dark/cms-cmp-text.svg'
      )
    );
  }

  getToolbarContextual(): ToolbarSection<ToolbarElement> {
    return new ToolbarSection<ToolbarElement>(
      new ToolbarBtn(
        'Toggle bold text',
        'Toggle bold font for the selected text',
        '/assets/img/icon/dark/font-bold.svg'
      ),
      new ToolbarBtn(
        'Toggle italic text',
        'Toggle italic font for the selected text',
        '/assets/img/icon/dark/font-italic.svg'
      ),
      new ToolbarDropdown('Test name', '1', new Map<string, any>(
        [
          ['Text body', 'Value 1'],
          ['Heading', 'Value 2'],
          ['Sub-Heading', 'Value 3']
        ]
      ))
    );
  }

  /*
  new ToolbarBtn(
        'New image',
        'Add a new image to the content',
        '/assets/img/icon/dark/cms-cmp-image.svg'
      )
   */

}
