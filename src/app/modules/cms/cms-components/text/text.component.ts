import {Component, Input, SecurityContext} from '@angular/core';
import {ToolbarBtn, ToolbarDropdown, ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less']
})
export class TextComponent extends AbstractCmsComponent {

  public text: string;

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              private sanitizer: DomSanitizer) {
    super();
  }

  public deserialize(serialized: any): void {
    const state = serialized;
    this.text = this.sanitizer.sanitize(SecurityContext.HTML, state.text);
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

  public getToolbarContextual(): ToolbarSection<ToolbarElement> {

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

  public validate(results: CmsValidationResults): void {

    if (this.text.trim() === '') {
      const r = results.addResult(new CmsValidationResult(true, 'errors.components.text.empty'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error in text component');
      });
    }

  }

}
