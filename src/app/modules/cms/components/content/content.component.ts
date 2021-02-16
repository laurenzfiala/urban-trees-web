import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {TextComponent} from '../../cms-components/text/text.component';
import {CmsComponent} from '../../interfaces/cms-component.interface';
import {SerializationService} from '../../services/serialization.service';
import {ContentService} from '../../services/content.service';
import {ToolbarBtn, ToolbarDropdown} from '../../entities/toolbar.entity';
import {TranslateInitService} from '../../../shared/services/translate-init.service';
import {AuthService} from '../../../shared/services/auth.service';
import {CmsContentConfig} from '../../entities/content-config.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {ToolbarService} from '../../services/toolbar.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {CmsLayoutSlot} from '../../entities/layout-slot.entity';
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
import {Subject} from 'rxjs/Subject';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContentService, ToolbarService]
})
export class ContentComponent extends AbstractCmsLayout implements OnInit, AfterViewInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ContentComponent);
  private static SUBSCRIPTION_TAG: string = 'cms-content-cmp';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public ToolbarDropdown = ToolbarDropdown;
  public ToolbarBtn = ToolbarBtn;

  @Input('contentId')
  private contentId: string;

  @Input('contentOrder')
  private contentOrder: number;

  @Input('contentLang')
  private contentLang: string;

  @Input('content')
  private content: CmsContent;

  @Output('contentChanged')
  private contentChanged: EventEmitter<CmsContent>;

  @Input('config')
  private config: CmsContentConfig;

  @ViewChild('contentSlot', {read: ViewContainerRef, static: true})
  public contentSlot: ViewContainerRef;

  /**
   * Subject that fires every time this content was saved.
   */
  public onSavedSubject: Subject<CmsContent>;

  /**
   * Tracks the last 50 changes made by the user for undo/redo
   * actions ans automatic saving.
   */
  private changes: Stack<CmsContent>;

  /**
   * Holds all CmsElements that are filled in this component.
   */
  private elements: Array<CmsElement>;

  /**
   * ID of window#setTimeout() used for deferred saving.
   * If 0, no timeout is currently scheduled.
   */
  private saveTimeoutId: number = 0;

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

    //this.cdRef.detach();

    this.elements = new Array<CmsElement>();
    this.changes = new Stack<CmsContent>(50);
    this.onSavedSubject = new Subject<CmsContent>();
    this.contentService.viewMode = ViewMode.CONTENT;

    const components = new CmsElementMap()
      .set(
        'TextComponent',
        EDBuilder.new()
          .type(TextComponent)
          .toolbarBtn(
            'New text passage',
            'Add a new text passage to the content',
            '/assets/img/icon/dark/cms-cmp-text.svg')
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
          .build()
        )
    ;

    this.contentService.setElementMap(CmsElementMap.combine(components, layouts));
    this.toolbar.registerStatic(components.getAllDescriptors(), layouts.getAllDescriptors());
    this.subs.register(this.contentService.onElementAdd().subscribe(value => this.onElementAdd(null, value)), ContentComponent.SUBSCRIPTION_TAG);

  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.updateContent(this.content);
  }

  /**
   * Update the content slots and add the elements to
   * the #elements array. Also add a checkpoint to the
   * #changes stack.
   * @param content content to display
   */
  private async updateContent(content: CmsContent): Promise<void> {
    this.changes.push(content);
    this.elements.push(...await this.fillSlotMultiple( () => this.contentSlot, ...content.content.elements));
  }

  /**
   * Load content using given content id from the backend.
   * TODO refactor this method to actually return a working promise
   *
   * TODO remove, we want the CmsContent to be loaded from outside!!!
   */
  /*private async loadContent(): Promise<void> {

    this.contentService.loadContent(this.contentId,
                                    this.contentLang,
                          userContents => {

      // TODO convert user content to cms content

      this.contentSlot.clear();
      const promises = new Array<Promise<CmsElement>>();
      for (let serializedEl of userContent.content) {
        const component = this.fillSlot(serializedEl, () => this.contentSlot, false); // TODO
        promises.push(component);
      }
      Promise.all(promises).then(value => {
        this.update();
      });

    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD, StatusValue.FAILED, apiError);
    });

  }*/

  private trackChange() {
    this.changes.push(this.serializationService.serializeContent(this.changes.peek(), ...this.elements));
  }

  /**
   * Saves the newest content from #changes to the backend.
   * If a save has occurred recently, depending on the environment variable contentSaveDebounceMs, it may
   * be deferred to a later time.
   * @param force (optional) pass true to *immediately* save/publish the latest content.
   * @param publish (optional) pass true to publish the latest content.
   */
  private saveContent(force: boolean = false,
                      publish: boolean = false): void {

    const now = Date.now();
    const lastSavedContent = this.lastSavedContent();
    if (!force && lastSavedContent && lastSavedContent.sent.getTime() > now - this.envService.contentSaveDebounceMs) {
      ContentComponent.LOG.trace('Saving is not yet allowed.');
      if (this.saveTimeoutId === 0) {
        const saveWaitMs = this.envService.contentSaveDebounceMs - now + lastSavedContent.sent.getTime();
        this.saveTimeoutId = window.setTimeout(
          () => this.saveContent(),
          saveWaitMs
        );
        ContentComponent.LOG.trace('Deferred save for ' + saveWaitMs / 1000 + 's using timeout handle ' + this.saveTimeoutId);
      } else {
        ContentComponent.LOG.trace('Save is already scheduled.');
      }
      return;
    }

    const content = this.changes.peek();
    if (!content) {
      throw new Error('Unexpected state: nothing found to save');
    } else if (content.sent !== undefined) {
      ContentComponent.LOG.debug('Content already saving/saved.');
      return;
    }
    ContentComponent.LOG.debug('Saving content...');
    this.setStatus(StatusKey.SAVE, StatusValue.IN_PROGRESS);
    window.clearTimeout(this.saveTimeoutId);
    this.saveTimeoutId = 0;
    content.sent = new Date();

    this.contentService.saveContent(this.contentId,
                                    this.contentOrder,
                                    this.contentLang,
                                    !publish,
                                    content,
                                    c => {
      ContentComponent.LOG.debug('Content successfully ' + (publish ? 'published' : 'saved') + '.');
      content.stored = c.stored;
      this.onSavedSubject.next(content);
      this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      ContentComponent.LOG.warn('Failed to save content.');
      content.sent = undefined;
      this.setStatus(StatusKey.SAVE, StatusValue.FAILED);
    });

  }

  /**
   * Get the latest saved CMS content.
   * @return CmsContent or null if none was found
   */
  public lastSavedContent(): CmsContent {
    return this.changes.find(e => e.sent !== undefined);
  }

  private elementChanged(element: CmsElement): void {
    this.trackChange();
    this.saveContent();
  }

  /**
   * Returns true if the service signals that this
   * component should display itself in edit mode.
   */
  public isEditContent(): boolean {
    return this.contentService.viewMode === ViewMode.EDIT_CONTENT;
  }

  deserialize(data: any): void {
    throw new Error('deserialize() is not supported');
  }

  getName(): string {
    throw new Error('getName() is not supported');
  }

  onElementAdd(slot: CmsLayoutSlot, element: CmsElement): void { // TODO layout slot may need to be changed/removed
    this.subs.register(
      element.onChanged().subscribe(e => {
        this.elementChanged(e);
      }),
      ContentComponent.SUBSCRIPTION_TAG
    );
    this.cdRef.detectChanges();
  }

  onElementRemove(component: CmsComponent): void {
    throw new Error('onComponentRemove() is not supported');
  }

  public onSaved(): Observable<CmsContent> {
    return this.onSavedSubject.asObservable();
  }

  serialize(): any {
    throw new Error('serialize() is not supported');
  }

  public validate(results: CmsValidationResults) {
    this.elements.forEach(e => {
      e.validate(results);
    });
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(ContentComponent.SUBSCRIPTION_TAG);
    window.clearTimeout(this.saveTimeoutId);
    this.onSavedSubject.complete();
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
