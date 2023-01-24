import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {ToolbarDropdown, ToolbarElement, ToolbarSection, ToolbarToggleBtn} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';
import {DomSanitizer} from '@angular/platform-browser';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {Editor} from '@tiptap/core';
import {Paragraph} from '@tiptap/extension-paragraph';
import {Bold} from '@tiptap/extension-bold';
import {Italic} from '@tiptap/extension-italic';
import {Heading} from '@tiptap/extension-heading';
import {Document} from '@tiptap/extension-document';
import {Text} from '@tiptap/extension-text';
import {Level} from '@tiptap/extension-heading/src/heading';
import CmsTextLinkComponentExtension from '../../components/cms-text-link/cms-text-link.extension';
import {HardBreak} from '@tiptap/extension-hard-break';
import {TranslateService} from '@ngx-translate/core';
import {Observable} from 'rxjs';
import {TooltipDirective} from 'ngx-bootstrap/tooltip';
import {once} from 'events';
import {Async2Pipe} from '../../../shared/pipes/async2.pipe';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubscriptionManagerService]
})
export class TextComponent extends AbstractCmsComponent implements OnInit, AfterViewInit, OnDestroy {

  private boldToggleBtn!: ToolbarToggleBtn;
  private italicsToggleBtn!: ToolbarToggleBtn;
  private headingDropdown!: ToolbarDropdown;
  private linkToggleBtn!: ToolbarToggleBtn;
  private toolbarContextual!: ToolbarSection<ToolbarElement>;

  public text!: string;

  @ViewChild('textEditElement')
  private textEditElement: ElementRef<HTMLDivElement>;

  @ViewChild('textEditElementTooltip', {read: TooltipDirective})
  private textEditElementTooltip: TooltipDirective;

  @ViewChild('linkModalTemplate')
  private linkModalTemplate: TemplateRef<any>;

  @ViewChild('linkModalTitleRef')
  private linkModalTitleRef: TemplateRef<any>;

  @ViewChild('linkModalHrefRef')
  private linkModalHrefRef: TemplateRef<any>;

  public editor = new Editor({
    extensions: [
      Document,
      Paragraph,
      HardBreak,
      Text,
      Bold,
      Italic,
      Heading.configure({
        levels: [1, 2],
      }),
      CmsTextLinkComponentExtension(this.injector)
    ],
    editorProps: {
      attributes: {
        class: 'cms-text-container cms-element-border'
      }
    },
    onFocus: () => this.focus(),
    onUpdate: () => this.onUpdate(),
    onSelectionUpdate: () => this.onSelectionchange()
  });

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              private envService: EnvironmentService,
              private subs: SubscriptionManagerService,
              private translate: TranslateService,
              private sanitizer: DomSanitizer,
              private injector: Injector) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.subs.reg(this.contentService.onViewModeChange()
      .subscribe(mode => this.update()));

    this.cdRef.detach();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.unsubAll();
    this.editor.destroy();
  }

  public async deserialize(serialized: any): Promise<void> {
    const state = serialized;
    this.text = state.text;
    this.update();
  }

  public serialize(): any {
    return {
      text: this.text
    };
  }

  public getName(): string {
    return this.constructor.name;
  }

  public onUpdate() {
    this.text = this.editor.getHTML();
    if (this.validationResults.hasErrors() && this.validationResults.hasHighlighted()) {
      this.validate().highlight();
      this.cdRef.detectChanges();
    }
    this.changed();
  }

  public getToolbarContextual(): ToolbarSection<ToolbarElement> {
    if (!this.toolbarContextual) {
      this.boldToggleBtn = new ToolbarToggleBtn(
        this.translate.get('components.text.bold.name'),
        this.translate.get('components.text.bold.description'),
        '/assets/img/icon/cms/font-bold.svg'
      )
      .setAction(value => this.bold())
      .destroyOn(this.onDestroy()) as ToolbarToggleBtn;

      this.italicsToggleBtn = new ToolbarToggleBtn(
        this.translate.get('components.text.italic.name'),
        this.translate.get('components.text.italic.description'),
        '/assets/img/icon/cms/font-italic.svg'
      )
      .setAction(value => this.italic())
      .destroyOn(this.onDestroy()) as ToolbarToggleBtn;

      this.headingDropdown = new ToolbarDropdown(
        this.translate.get('components.text.heading.name'),
        0,
        new Map<string | Observable<string>, any>(
          [
            [this.translate.get('components.text.heading.text'), 0],
            [this.translate.get('components.text.heading.h1'), 1],
            [this.translate.get('components.text.heading.h2'), 2]
          ]
        ))
      .setChange(value => this.onTextStyleDropdownChange(value))
      .destroyOn(this.onDestroy());

      this.linkToggleBtn = new ToolbarToggleBtn(
        this.translate.get('components.text.link.name'),
        this.translate.get('components.text.link.description'),
        '/assets/img/icon/cms/link.svg'
      )
      .setAction(value => this.link(value))
      .destroyOn(this.onDestroy()) as ToolbarToggleBtn;

      this.toolbarContextual = new ToolbarSection<ToolbarElement>(
        this.boldToggleBtn,
        this.italicsToggleBtn,
        this.headingDropdown,
        this.linkToggleBtn
      );
    }
    return this.toolbarContextual;
  }

  public validate(results?: CmsValidationResults): CmsValidationResults {

    this.validationResults.reset();
    if (this.editor.state.doc.textContent.trim() === '') {
      const result = new CmsValidationResult(true, this.translate.get('components.text.validation.empty'));
      result.onHighlight().subscribe(value => {
        this.cdRef.detectChanges();
      });

      this.validationResults.addResult(result);
      results?.addResult(result);
    }
    return this.validationResults;

  }

  public onSelectionchange(): boolean {

    if (this.boldToggleBtn) {
      this.boldToggleBtn.active = this.editor.isActive('bold');
    }
    if (this.italicsToggleBtn) {
      this.italicsToggleBtn.active = this.editor.isActive('italic');
    }

    if (this.headingDropdown && this.editor.isActive('heading')) {
      let prevLevel = this.editor.getAttributes('heading')?.level;
      if (!prevLevel) {
        prevLevel = 0;
      }
      this.headingDropdown.selectedValue = prevLevel;
    }

    this.toolbar.update();
    return true;

  }

  private onTextStyleDropdownChange(value: any) {

    const selectedLevel = Number.parseInt(value, 10);
    const hasHeading = this.editor.isActive('heading');
    if (hasHeading && selectedLevel === 0) {
      const prevLevel = this.editor.getAttributes('heading').level;
      this.editor.chain().focus().toggleHeading({level: prevLevel}).run();
    } else if (selectedLevel > 0) {
      this.editor.chain().focus().setHeading({level: selectedLevel as Level}).run();
    }

  }

  private bold(): void {
    this.editor.chain().focus().toggleBold().run();
  }

  private italic(): void {
    this.editor.chain().focus().toggleItalic().run();
  }

  private link(toolbarBtn: ToolbarToggleBtn): void {
    const buttonEl = toolbarBtn.element;
    const arrowPos = buttonEl.offsetLeft + (buttonEl.offsetWidth / 2);
    this.toolbar.modal({template: this.linkModalTemplate, show: toolbarBtn.active, arrowPos: arrowPos + 'px'});
  }

  public insertLink(text: string, href: string): void {

    this.editor.chain()
      .focus()
      .insertContent([
        {
          type: 'cmsTextLink',
          attrs: {
            'href': href,
            'text': text
          }
        }
      ])
      .run();
    this.linkToggleBtn.active = false;
    this.toolbar.modal({template: this.linkModalTemplate, show: false});

  }
}
