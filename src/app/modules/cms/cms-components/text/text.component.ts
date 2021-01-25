import {Component, Input} from '@angular/core';
import {ToolbarBtn, ToolbarDropdown, ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entities';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less']
})
export class TextComponent extends AbstractCmsComponent {

  @Input()
  public text: string;

  constructor(protected toolbar: ToolbarService) {
    super();
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

  public updateText(event: Event) {
    this.text = (event.target as HTMLElement).innerHTML;
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

  validate(): Array<CmsValidationResult> {
    throw new Error('Method not implemented.'); // TODO
  }
}
