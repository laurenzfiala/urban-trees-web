import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TextComponent} from '../../cms-components/text/text.component';
import {SerializationService} from '../../services/serialization.service';
import {ContentService} from '../../services/content.service';
import {ToolbarBtn, ToolbarDropdown} from '../../entities/toolbar.entity';
import {TranslateInitService} from '../../../shared/services/translate-init.service';
import {AuthService} from '../../../shared/services/auth.service';
import {CmsContentConfig} from '../../entities/content-config.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {ToolbarService} from '../../services/toolbar.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {CmsElement} from '../../interfaces/cms-element.interface';
import {Log} from '../../../shared/services/log.service';
import {BlockLayout} from '../../cms-layouts/block-layout/block-layout.component';
import {CmsElementMap, EDBuilder} from '../../entities/cms-element-map.entity';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';
import {TwoColumnLayout} from '../../cms-layouts/two-column-layout/two-column-layout.component';
import {Stack} from '../../entities/stack.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {CmsContent} from '../../entities/cms-content.entity';
import {Observable} from 'rxjs/Observable';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {FileComponent} from '../../cms-components/file/file.component';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ContentService, ToolbarService, SubscriptionManagerService]
})
export class ContentComponent extends AbstractCmsLayout implements OnInit, AfterViewInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ContentComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public ToolbarDropdown = ToolbarDropdown;
  public ToolbarBtn = ToolbarBtn;

  /**
   * Content path which the given CmsContent belongs to.
   * May not be undefined/null.
   */
  @Input()
  private contentPath: string;

  /**
   * Content language to display, may no be null/undefined.
   */
  @Input()
  private contentLang: string;

  /**
   * Content to display, may not be undefined/null.
   * Use CmsContent#fromUserContent() to convert backend response to CmsContent.
   *
   * To avoid infinite loops, this must be set before this component's #ngAfterViewInit().
   * No later changes to this input are accepted.
   */
  @Input()
  private content: CmsContent;

  @Input()
  private config: CmsContentConfig;

  @Input()
  set viewMode(mode: ViewMode) {
    this.contentService.viewMode = mode;
    this.update();
  }

  @Output()
  private contentChange: EventEmitter<CmsContent> = new EventEmitter<CmsContent>();

  @Output()
  private contentSave: EventEmitter<CmsContent> = new EventEmitter<CmsContent>();

  @Output()
  private viewModeChange: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  @ViewChild('contentSlot', {read: ViewContainerRef, static: true})
  public contentSlot: ViewContainerRef;
  /**
   * Tracks the last 50 changes made by the user for undo/redo
   * actions and automatic saving.
   */
  private changes: Stack<CmsContent>;

  /**
   * Holds all CmsElement-instances that are filled in this component.
   */
  private elements: Array<CmsElement>;

  /**
   * ID of window#setTimeout() used for deferred saving.
   * If 0, no timeout is currently scheduled.
   */
  private saveTimeoutId: number = 0;

  /**
   * This holds the CMS element type of the
   * last ToolbarBtn the user used.
   */
  private addComponentType: Type<unknown>;

  /**
   * TODO doc
   * TODO also implement app-internal nav check
   */
  @HostListener('window:beforeunload')
  public onBeforeUnload(): any {
    return this.changes.size() === 0 || this.changes.peek().isStored();
  }

  constructor(protected resolver: ComponentFactoryResolver,
              protected cdRef: ChangeDetectorRef,
              private translateInit: TranslateInitService,
              private authService: AuthService,
              protected contentService: ContentService,
              private serializationService: SerializationService,
              private subs: SubscriptionManagerService,
              public toolbar: ToolbarService,
              private envService: EnvironmentService) {
    super();
  }

  ngOnInit(): void {

    this.contentService.onUpdate().subscribe(value => {
      this.cdRef.markForCheck();
    }); // TODO

    this.elements = new Array<CmsElement>();
    this.changes = new Stack<CmsContent>(50);

    const components = new CmsElementMap()
      .set(
        'TextComponent',
        EDBuilder.new()
          .type(TextComponent)
          .toolbarBtn(
            'New text passage',
            'Add a new text passage to the content',
            '/assets/img/icon/dark/cms-cmp-text.svg')
          .onAction({next: value => this.addComponent(TextComponent)}, sub => this.subs.reg(sub))
          .build()
      )
      .set(
        'FileComponent',
        EDBuilder.new()
          .type(FileComponent)
          .toolbarBtn(
            'New file',
            'Add a new file to the content',
            '/assets/img/icon/dark/cms-cmp-text.svg')
          .onAction({next: value => this.addComponent(FileComponent)}, sub => this.subs.reg(sub))
          .build()
      )
    ;

    const layouts = new CmsElementMap()
      .set(
        'BlockLayout',
        EDBuilder.new()
          .type(BlockLayout)
          .toolbarBtn(
            'Block layout',
            'The component takes up the whole width of the page',
            '/assets/img/icon/dark/cms-cmp-text.svg')
          .onAction({next: (value) => window.alert('block')}, sub => this.subs.reg(sub))
          .build()
        )
      .set(
        'TwoColumnLayout',
        EDBuilder.new()
          .type(TwoColumnLayout)
          .toolbarBtn(
            'Two-column layout',
            'Two components are displayed besides each other',
            '/assets/img/icon/dark/cms-cmp-text.svg')
          .onAction({next: (value) => window.alert('two col')}, sub => this.subs.reg(sub))
          .build()
        )
    ;

    this.contentService.setElementMap(CmsElementMap.combine(components, layouts));
    this.toolbar.registerStatic(components.getAllDescriptors(), layouts.getAllDescriptors());
    this.subs.reg(this.contentService.onElementAdd().subscribe(value => this.onElementAdd(value)));
    this.subs.reg(this.contentService.onViewModeChange().subscribe(value => this.viewModeChange.emit(value)));

  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateContent(this.content);
  }

  /**
   * Update the content slots and add the elements to
   * the #elements array. Also add a checkpoint to the
   * #changes stack.
   * @param content content to display. may not be undefined/null.
   */
  private async updateContent(content: CmsContent): Promise<void> {
    let elements = [];
    if (content?.content?.elements) {
      elements = content?.content?.elements;
    }
    this.elements.push(...await this.fillSlotMultiple( () => this.contentSlot, ...elements));
    this.changes.push(content);
    this.content = content;
    this.contentChange.emit(content);
  }

  /**
   * Serialize the current content state and push it to the changes stack.
   * Afterwards, triggers #contentChange event.
   * @param base (optional) the CmsContent the newly serialized content is based off.
   *             this determines e.g. the historyId. if the base is not given, we instead use
   *             the last cms content in the #changes stack as the base.
   */
  private trackChange(base?: CmsContent): void {

    if (!base) {
      base = this.changes.peek();
    }
    const content = this.serializationService.serializeContent(base, ...this.elements);
    this.changes.push(content);
    this.content = content;
    this.contentChange.emit(content);

  }

  /**
   * Saves the newest content from #changes to the backend.
   * If a save has occurred recently, depending on the environment variable contentSaveDebounceMs, it may
   * be deferred to a later time.
   * @param force (optional) pass true to *immediately* save/publish the latest content.
   * @param publish (optional) pass true to publish the latest content.
   */
  private async saveContent(force: boolean = false,
                            publish: boolean = false): Promise<CmsContent> {

    const now = Date.now();
    const lastSavedContent = this.lastSavedContent();
    if (!force && lastSavedContent && lastSavedContent.sent.getTime() > now - this.envService.contentSaveDebounceMs) {
      ContentComponent.LOG.trace('Saving is not yet allowed.');
      if (this.saveTimeoutId === 0) {
        const saveWaitMs = this.envService.contentSaveDebounceMs - now + lastSavedContent.sent.getTime();
        await new Promise((resolve, reject) => {
          this.saveTimeoutId = window.setTimeout(resolve, saveWaitMs);
          ContentComponent.LOG.trace('Deferred save for ' + saveWaitMs / 1000 + 's using timeout handle ' + this.saveTimeoutId);
        });
      } else {
        ContentComponent.LOG.trace('Save is already scheduled.');
        return;
      }
    }

    const content = this.changes.peek();
    if (!content) {
      return Promise.reject(new Error('Unexpected state: nothing found to save'));
    } else if (content.sent !== undefined && !publish) {
      ContentComponent.LOG.info('Content was already saved. Skipping save.');
      return Promise.resolve(content);
    }
    ContentComponent.LOG.debug('Saving content...');
    this.setStatus(StatusKey.SAVE, StatusValue.IN_PROGRESS);
    window.clearTimeout(this.saveTimeoutId);
    this.saveTimeoutId = 0;
    content.sent = new Date();

    return new Promise((resolve, reject) => {
      this.contentService.saveContent(this.contentPath,
                                      this.contentLang,
                                      !publish,
                                      content,
                                      c => {
        ContentComponent.LOG.debug('Content successfully ' + (publish ? 'published' : 'saved') + '.');
        content.stored = c.stored;
        content.historyId = c.historyId;
        content.previousId = c.previousId;
        content.nextId = c.nextId;
        this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
        this.contentSave.emit(content);
        resolve(content);
      }, (error, apiError) => {
        ContentComponent.LOG.warn('Failed to save content.');
        content.sent = undefined;
        this.setStatus(StatusKey.SAVE, StatusValue.FAILED);
        reject(apiError.message);
      });
    });

  }

  /**
   * Get the latest saved CMS content.
   * @return CmsContent or null if none was found
   */
  public lastSavedContent(): CmsContent {
    return this.changes.find(e => e.sent !== undefined);
  }

  /**
   * Returns true if the service signals that this
   * component should display itself in edit mode.
   */
  public isEditContent(): boolean {
    return this.contentService.viewMode === ViewMode.EDIT_CONTENT;
  }

  // TODO
  private addComponent(type: Type<unknown>): void {

    this.contentService.viewMode = ViewMode.EDIT_LAYOUT;
    this.addComponentType = type;

  }

  // TODO
  public async appendComponent(): Promise<void> {
    this.elements.push(await this.fillSlot(() => this.contentSlot, this.addComponentType));
    this.cdRef.markForCheck();
    return;
  }

  async deserialize(data: any): Promise<void> {
    throw new Error('deserialize() is not supported');
  }

  getName(): string {
    throw new Error('getName() is not supported');
  }

  onElementAdd(element: CmsElement): void { // TODO layout slot may need to be changed/removed
    super.onElementAdd(element);
    this.contentService.viewMode = ViewMode.CONTENT;
    this.subs.register(
      element.onChanged().subscribe(e => {
        this.trackChange();
        this.saveContent();
      })
    );
  }

  onElementRemove(element: CmsElement): void {
    super.onElementRemove(element);
    throw new Error('onComponentRemove() is not supported');
  }

  public onSaved(): Observable<CmsContent> {
    return this.contentSave.asObservable();
  }

  serialize(): any {
    throw new Error('serialize() is not supported');
  }

  public validate(results: CmsValidationResults) {
    this.elements.forEach(e => {
      e.validate(results);
    });
  }

  /**
   * Close the content edit mode.
   * Publishes the content draft and displays the content
   * without editing UI.
   */
  public publish(): void {
    this.saveContent(true, true).then(value => {
      this.contentService.viewMode = ViewMode.CONTENT;
    }).catch(reason => {
      ContentComponent.LOG.error(reason);
    }).finally(() => {
      this.cdRef.markForCheck();
    });
  }

  /**
   * Close the content edit mode.
   * Saves the content draft and displays the content
   * without editing UI.
   */
  public close(): void {
    this.saveContent(true).then(value => {
      this.contentService.viewMode = ViewMode.CONTENT;
    }).catch(reason => {
      ContentComponent.LOG.error(reason);
    }).finally(() => {
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.subs.unsubAll();
    window.clearTimeout(this.saveTimeoutId);
  }

}

export enum StatusKey {

  SAVE

}

export enum StatusValue {

  NONE,
  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
