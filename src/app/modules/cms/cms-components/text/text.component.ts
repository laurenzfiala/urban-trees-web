import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
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
import {fromEvent, ReplaySubject} from 'rxjs';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';

@Component({
  selector: 'ut-cms-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SubscriptionManagerService]
})
export class TextComponent extends AbstractCmsComponent implements OnInit, AfterViewInit, OnDestroy {

  private onSelectionChangeSubject: ReplaySubject<any> = new ReplaySubject<any>();

  private toolbarContextual = new ToolbarSection<ToolbarElement>(
    new ToolbarBtn(
      'Toggle bolded text',
      'Toggle bold font for the selected text',
      '/assets/img/icon/cms/font-bold.svg'
    )
    .setAction(value => this.bold())
    .destroyOn(this.onDestroy()),
    new ToolbarBtn(
      'Toggle italic text',
      'Toggle italic font for the selected text',
      '/assets/img/icon/cms/font-italic.svg'
    )
    .setAction(value => this.italic())
    .destroyOn(this.onDestroy()),
    new ToolbarDropdown('Test name', 'text', new Map<string, any>(
      [
        ['Text body', 'text'],
        ['Heading', 'H1'],
        ['Sub-Heading', 'H2']
      ]
    ))
    .setChange(this.onTextStyleDropdownChange())
    .setValueOn(this.onSelectionChangeSubject.asObservable())
    .destroyOn(this.onDestroy()),
    new ToolbarBtn(
      'Create link',
      'Create a new inline link',
      '/assets/img/icon/cms/link.svg'
    )
    .setAction(value => this.link())
    .destroyOn(this.onDestroy())
  );

  public text: string;

  @ViewChild('textEditElement')
  private textEditElement: ElementRef<HTMLDivElement>;

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              private subs: SubscriptionManagerService,
              private sanitizer: DomSanitizer,
              private zone: NgZone) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngAfterViewInit() {

    this.subs.reg(fromEvent(this.textEditElement.nativeElement, 'focus')
      .subscribe(e => this.focus()));
    this.subs.reg(fromEvent(this.textEditElement.nativeElement, 'input')
      .subscribe(e => this.updateText()));
    this.subs.reg(fromEvent(this.textEditElement.nativeElement, 'paste')
      .subscribe(e => this.onPaste(e as ClipboardEvent)));
    this.subs.reg(fromEvent(this.textEditElement.nativeElement, 'keydown')
      .subscribe(e => this.onKeydown(e as KeyboardEvent)));
    this.subs.reg(fromEvent(document, 'selectionchange')
      .subscribe(e => this.onSelectionchange(e as Event)));

    this.subs.reg(this.contentService.onViewModeChange()
      .subscribe(mode => this.update()));

    document.execCommand('styleWithCSS', false, 'false');

    this.cdRef.detach();

  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.subs.unsubAll();
  }

  public async deserialize(serialized: any): Promise<void> {
    const state = serialized;
    this.text = this.sanitizer.sanitize(SecurityContext.HTML, state.text);
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

  public updateText() {
    this.text = this.textEditElement.nativeElement.innerHTML;
    this.changed();
  }

  public getToolbarContextual(): ToolbarSection<ToolbarElement> {
    return this.toolbarContextual;
  }

  public validate(results: CmsValidationResults): void {

    if (this.text.trim() === '') {
      const r = results.addResult(new CmsValidationResult(true, 'errors.components.text.empty'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error in text component');
      });
    }

  }

  public onPaste(event: ClipboardEvent): boolean {
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
    this.updateText();
    event.preventDefault();
    return true;
  }

  public onKeydown(event: KeyboardEvent): boolean {
    if (event.ctrlKey && event.key === 'z') {
      this.contentService.undo();
      event.preventDefault();
    } else if (event.ctrlKey && event.key === 'y') {
      this.contentService.undo(false);
      event.preventDefault();
    }
    return true;
  }

  public onSelectionchange(event: Event): boolean {
    const selection = window.getSelection();
    if (!selection?.anchorNode) {
      return true;
    }
    let textType = 'text';
    let el = selection.anchorNode.parentElement;
    while (true) {
      if (!el) {
        break;
      }
      if (el.tagName === 'H1' || el.tagName === 'H2') {
        textType = el.tagName;
        break;
      }
      el = el.parentElement;
    }
    this.onSelectionChangeSubject.next(textType);
    this.toolbar.update();
    return true;
  }

  private onTextStyleDropdownChange() {
    return function (value: any) {
      if (value === 'text') {
        document.execCommand('formatBlock', false, 'div');
      } else {
        document.execCommand('formatBlock', false, value);
      }
    };
  }

  private bold(): void {
    document.execCommand('bold', false, null);
  }

  private italic(): void {
    document.execCommand('italic', false, null);
  }

  private link(): void {
    const selection = window.getSelection();
    if (selection?.getRangeAt(0)?.toString().length === 0) {
      window.alert('You must select text first');
    }
    let url = window.prompt('Enter the link');
    document.execCommand('createLink', false, url);
  }
}
