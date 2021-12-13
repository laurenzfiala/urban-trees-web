import {
  AfterContentInit, AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, Inject,
  NgZone, OnInit,
  SecurityContext,
  ViewChild
} from '@angular/core';
import {ToolbarBtn, ToolbarDropdown, ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';
import {DomSanitizer} from '@angular/platform-browser';
import {fromEvent} from 'rxjs';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextComponent extends AbstractCmsComponent implements AfterViewInit {

  public text: string;

  @ViewChild('textEditElement')
  private textEditElement: ElementRef<HTMLDivElement>;

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              private sanitizer: DomSanitizer,
              private zone: NgZone) {
    super();
  }

  ngAfterViewInit() {

    this.zone.runOutsideAngular(args => {
      fromEvent(this.textEditElement.nativeElement, 'focus')
        //.pipe(takeUntil(this._destroyed$))
        .subscribe(e => {
          this.focus();
        });
      fromEvent(this.textEditElement.nativeElement, 'input')
        //.pipe(takeUntil(this._destroyed$))
        .subscribe(e => {
          this.updateText(e);
        });
    });
    // TODO unsub

  }

  public async deserialize(serialized: any): Promise<void> {
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
    this.changed();
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
