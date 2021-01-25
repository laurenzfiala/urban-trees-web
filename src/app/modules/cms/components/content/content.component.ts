import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  Input,
  OnDestroy,
  OnInit,
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
import {CmsValidationResult} from '../../entities/cms-validation-result.entities';
import {CmsElement} from '../../interfaces/cms-element.interface';
import {Log} from '../../../shared/services/log.service';
import {BlockLayout} from '../../cms-layouts/block-layout/block-layout.component';
import {CmsElementMap, EDBuilder} from '../../entities/cms-element-map.entity';
import {SerializedCmsContent} from '../../entities/serialized-cms-content.entity';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';
import {TwoColumnLayout} from '../../cms-layouts/two-column-layout/two-column-layout.component';
import {Stack} from '../../entities/stack.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ContentService, ToolbarService]
})
export class ContentComponent extends AbstractCmsLayout implements OnInit, AfterViewInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ContentComponent);
  private static SUBSCRIPTION_TAG: string = 'cms-content';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public ToolbarDropdown = ToolbarDropdown;
  public ToolbarBtn = ToolbarBtn;

  @Input('contentId')
  private contentId: string;

  @Input('config')
  private config: CmsContentConfig;

  @ViewChild('contentSlot', {read: ViewContainerRef})
  public contentSlot: ViewContainerRef;

  private changes: Stack<SerializedCmsContent>;
  private elements: Array<CmsElement>;
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

    this.elements = new Array<CmsElement>();
    this.changes = new Stack<SerializedCmsContent>(50);

    // TODO remove
    this.setStatus(StatusKey.SAVE, StatusValue.FAILED);

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

    // TODO load content if needed

    // TODO remove
    this.addTestContent();

  }

  // TODO remove
  private async addTestContent(): Promise<void> {

    const test = SerializedCmsContent.fromObject({
      version: 1,
      saved: '2020-10-19T09:26:55',
      stored: '2020-10-19T09:27:00',
      elements: [
        {
          name: 'TwoColumnLayout',
          data: {
            slotLeft: {
              name: 'TextComponent',
              data: {
                text: 'left'
              }
            },
            slotRight: {
              name: 'TextComponent',
              data: {
                text: 'right'
              }
            }
          }
        }
      ]
    }, this.envService);
    this.elements.push(await this.fillSlot(test.elements[0], () => this.contentSlot));

  }

  /**
   * Load content using given content id from the backend.
   * TODO refactor this method to actually return a working promise
   */
  private async loadContent(): Promise<void> {

    this.contentService.loadContent(this.contentId, serializedContent => {

      this.contentSlot.clear();
      const promises = new Array<Promise<CmsElement>>();
      for (let serializedEl of serializedContent.elements) {
        const component = this.fillSlot(serializedEl, () => this.contentSlot, false); // TODO
        promises.push(component);
      }
      Promise.all(promises).then(value => {
        this.update();
      });

    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD, StatusValue.FAILED, apiError);
    });

  }

  /**
   * Saves the newest content from #changes to the backend.
   * If a save has occurred recently, depending on the environment variable contentSaveDebounceMs, it may
   * be deferred to a later time.
   * @param force (optional) pass true to immediately save the latest content.
   */
  private saveContent(force: boolean = false): void {

    const now = Date.now();
    const lastSavedContent = this.changes.find(e => e.sent !== undefined);
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
    this.update();

    this.contentService.saveContent(this.contentId, content, c => {
      ContentComponent.LOG.debug('Content successfully saved.');
      // TODO content.stored = c; -- maybe remove
      this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
      this.update();
    }, (error, apiError) => {
      ContentComponent.LOG.warn('Failed to save content.');
      content.sent = undefined;
      this.setStatus(StatusKey.SAVE, StatusValue.FAILED);
      this.update();
    });

  }

  /**
   * Whether the current user has permission to
   * publish the content without prior approval.
   */
  public canUserPublish(): boolean {
    return this.authService.isAdmin();
  }

  private elementChanged(element: CmsElement): void { // TODO move save logic to own function
    this.changes.push(this.serializationService.serializeContent(...this.elements));
    this.saveContent();
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
  }

  onElementRemove(component: CmsComponent): void {
    throw new Error('onComponentRemove() is not supported');
  }

  serialize(): any {
    throw new Error('serialize() is not supported');
  }

  validate(): Array<CmsValidationResult> {
    throw new Error('validate() is not supported');
  }

  view(mode: ViewMode): void {
    throw new Error('view() is not supported');
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe(ContentComponent.SUBSCRIPTION_TAG);
  }

}

export enum StatusKey {

  SAVE,
  LOAD

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
