import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
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
import {EnvironmentService} from '../../../shared/services/environment.service';
import {CmsContent} from '../../entities/cms-content.entity';
import {Observable} from 'rxjs/Observable';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {FileComponent} from '../../cms-components/file/file.component';
import {Router} from '@angular/router';
import {ExpDaysLayout} from '../../cms-layouts/exp-days/exp-days.component';
import {ToolbarBtn} from '../../entities/toolbar.entity';
import {EditLayoutDropzoneComponent} from '../edit-layout-dropzone/edit-layout-dropzone.component';
import {ImageComponent} from '../../cms-components/image/image.component';
import {timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {CmsContentChange} from '../../entities/cms-content-change';
import {CmsContentChangeState} from '../../entities/cms-content-change-state';
import {SerializedCmsElement} from '../../entities/serialized-cms-element.entity';
import {NotificationsService} from '../../../trees/services/notifications.service';
import {Notification, NotificationType} from '../../../trees/entities/notification.entity';
import {TooltipDirective} from 'ngx-bootstrap/tooltip';
import {PopoverDirective} from 'ngx-bootstrap/popover';
import {TranslateService} from '@ngx-translate/core';
import {UserContent} from '../../entities/user-content.entity';
import {UserContentStatus} from '../../entities/user-content-status.entity';

@Component({
  selector: 'ut-cms-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less', '../content-toolbar/content-toolbar.shared.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [ContentService, ToolbarService, SubscriptionManagerService]
})
export class ContentComponent extends AbstractCmsLayout implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ContentComponent);

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  /**
   * Must be set upon initialization and must not be undefined/null.
   * Changes to the same instance are ignored. Once a new instance is given, the component rerenders.
   * Note: Use CmsContent#fromUserContent() to convert backend response to CmsContent, but make
   *       sure to cache the instance so this component does not rerender all the time.
   * @see #_content
   * TODO doc
   */
  @Input('content')
  set contentInput(input: UserContent) {
    if (!input || this.userContent === input) {
      return;
    }
    this.userContent = input;
    let cmsContent = CmsContent.fromUserContent(input, this.envService);
    this.content = cmsContent;
    this.onAfterViewInit().then(() => {
      this.reset();
      if (!cmsContent.content?.elements) {
        this.fillContentSlot([]);
      } else {
        this.fillContentSlot(cmsContent.content.elements);
        const initialContentChange = CmsContentChange.fromCmsContent(cmsContent, this.envService);
        initialContentChange.stored = cmsContent.stored;
        initialContentChange.isDraft = input.status === UserContentStatus.DRAFT;
        this.changeConfig.changes.push(initialContentChange);
      }
    });
  }

  @Input()
  public config: CmsContentConfig = new CmsContentConfig(
    [],
    []
  );

  @Input()
  set viewMode(mode: ViewMode) {
    this.contentService.viewMode = mode;
    this.update();
  }

  @Output()
  private reloadContent: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  private contentSave: EventEmitter<UserContent> = new EventEmitter<UserContent>();

  @Output()
  private viewModeChange: EventEmitter<ViewMode> = new EventEmitter<ViewMode>();

  @ViewChild('contentSlot', {read: ViewContainerRef, static: true})
  public contentSlot: ViewContainerRef;

  @ViewChild('closeBtnTooltip', {read: TooltipDirective})
  public closeBtnTooltip: TooltipDirective;

  @ViewChild('closeBtnPopover', {read: PopoverDirective})
  public closeBtnPopover: PopoverDirective;

  /**
   * Holds all state values related to change tracking.
   */
  private changeConfig: CmsContentChangeState = new CmsContentChangeState();

  /**
   * ID of window#setTimeout() used for deferred saving.
   * If 0, no timeout is currently scheduled.
   */
  private saveTimeoutId: number = 0;

  /**
   * Holds all CmsElement-instances that are currently
   * filled in this component.
   */
  private elements: Array<CmsElement>;

  /**
   * This holds the CMS element type of the
   * last ToolbarBtn the user used.
   */
  private addComponentType: Type<unknown>;

  /**
   * This holds the toolbar btn of the
   * last ToolbarBtn the user used.
   */
  private addComponentBtn: ToolbarBtn;

  /**
   * When the user navigates away from the page and there
   * are still unsaved changes, we want to confirm leaving.
   *
   * TODO also implement app-internal nav check
   * NOTE: there is currently no way to check deactivation on children,
   *       therefore we must wait for this feature to be implemented in
   *       a future Angular release.
   *       See https://github.com/angular/angular/issues/11836
   */
  @HostListener('window:beforeunload')
  public onBeforeUnload(): any {
    return this.changeConfig.unsavedChanges <= 0;
  }

  constructor(protected cdRef: ChangeDetectorRef,
              private authService: AuthService,
              protected contentService: ContentService,
              private serializationService: SerializationService,
              protected subs: SubscriptionManagerService,
              public translate: TranslateService,
              public toolbar: ToolbarService,
              private router: Router,
              private notifications: NotificationsService,
              private envService: EnvironmentService) {
    super();
  }

  ngOnInit(): void {
    this.reset();

    const components = new CmsElementMap()
      .set(
        'TextComponent',
        EDBuilder.new()
          .type(TextComponent)
          .toolbarBtn(
            this.translate.get('components.text.name'),
            this.translate.get('components.text.description'),
            '/assets/img/icon/cms/cmp-text.svg')
          .onAction({next: self => { this.addComponent(TextComponent, self); }}, sub => this.subs.reg(sub))
          .build()
      )
      .set(
        'FileComponent',
        EDBuilder.new()
          .type(FileComponent)
          .toolbarBtn(
            this.translate.get('components.file.name'),
            this.translate.get('components.file.description'),
            '/assets/img/icon/cms/cmp-file.svg')
          .onAction({next: self => this.addComponent(FileComponent, self)}, sub => this.subs.reg(sub))
          .build()
      )
      .set(
        'ImageComponent',
        EDBuilder.new()
          .type(ImageComponent)
          .toolbarBtn(
            this.translate.get('components.img.name'),
            this.translate.get('components.img.description'),
            '/assets/img/icon/cms/cmp-image.svg')
          .onAction({next: self => this.addComponent(ImageComponent, self)}, sub => this.subs.reg(sub))
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
        'ExpDaysLayout',
        EDBuilder.new()
          .type(ExpDaysLayout)
          .toolbarBtn(
            'Experimentation days layout',
            '',
            '/assets/img/icon/dark/cms-cmp-text.svg')
          .onAction({next: (value) => window.alert('expdays')}, sub => this.subs.reg(sub))
          .build()
      )
    ;

    this.contentService.setElementMap(CmsElementMap.combine(components, layouts));
    this.toolbar.registerStatic(components.getAllDescriptors(), layouts.getAllDescriptors());

    this.subs.reg(this.contentService.onUpdate().subscribe(value => this.cdRef.detectChanges()));
    this.subs.reg(this.contentService.onUndo().subscribe(value => this.undo(value)));
    this.subs.reg(this.contentService.onElementRemove().subscribe(value => this.removeElement(value)));
    this.subs.reg(this.contentService.onElementDropped().subscribe(value => this.insertElement(value)));
    this.subs.reg(this.contentService.onViewModeChange().subscribe(value => this.onViewModeChange(value)));

  }

  /**
   * Reset state.
   */
  private reset(): void {
    this.elements = new Array<CmsElement>();
    this.changeConfig = new CmsContentChangeState();
  }

  /**
   * If serializedCmsElements is given, fill #elements with
   * the given elements; if no elements are given, re-fill
   * content slot with current #elements.
   * #elements is updated to reflect the newly instatiated elements.
   * @param serializedCmsElements (optional) elements to fill
   */
  private async fillContentSlot(serializedCmsElements?: SerializedCmsElement[]): Promise<void> {
    let elements;
    if (serializedCmsElements) {
      elements = serializedCmsElements;
    } else {
      elements = this.serializationService.serializeElements(...this.elements);
    }
    this.elements = await this.fillSlotMultiple( () => this.contentSlot, ...elements);
    this.update();
  }

  /**
   * Serialize the current content state and push it to the changes stack.
   * Afterwards, triggers #contentChange event.
   * @param base (optional) the CmsContent the newly serialized content is based off.
   *             this determines e.g. the historyId. if the base is not given, we instead use
   *             the last cms content in the #changes stack as the base.
   * @param checkLastChangeDate (default true) if false, a change is registered regardless of time since last change
   * @param force (default false) if true, registers a new change even if no change has occurred since last
   */
  private trackChange(checkLastChangeDate: boolean = true,
                      force: boolean = false): void {

    this.changeConfig.unsavedChanges++;
    if (checkLastChangeDate &&
        this.changeConfig.lastTrackedChange.getTime() > new Date().getTime() - this.envService.contentUndoHistoryDebounceMs) {
      ContentComponent.LOG.trace('Not tracking content change since 10s debounce has not yet been reached.');
      return;
    }
    if (!force && !this.changeConfig.hasUntrackedChange) {
      ContentComponent.LOG.trace('Not tracking content change since it has not changed.');
      return;
    }
    const content = this.serializationService.serializeContent(this.content, ...this.elements);
    const contentChange = CmsContentChange.fromCmsContent(content, this.envService);
    contentChange.stored = content.stored;
    contentChange.isDraft = true;
    this.content = content;
    this.changeConfig.changes.push(contentChange);
    this.changeConfig.lastTrackedChange = new Date();
    this.changeConfig.hasUntrackedChange = false;

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
    const lastSentContent = this.changeConfig.lastSentContent;
    if (!force && lastSentContent?.getTime() > now - this.envService.contentSaveDebounceMs) {
      ContentComponent.LOG.trace('Saving is not yet allowed.');
      if (this.saveTimeoutId === 0) {
        const saveWaitMs = this.envService.contentSaveDebounceMs - now + lastSentContent.getTime();
        await new Promise((resolve, reject) => {
          this.saveTimeoutId = window.setTimeout(resolve, saveWaitMs);
          ContentComponent.LOG.trace('Deferred save for ' + saveWaitMs / 1000 + 's using timeout handle ' + this.saveTimeoutId);
        });
      } else {
        ContentComponent.LOG.trace('Save is already scheduled.');
        return;
      }
    }

    let content;
    let contentChange;
    if (this.changeConfig.hasUntrackedChange) {
      content = this.serializationService.serializeContent(this.content, ...this.elements);
    } else {
      contentChange = this.changeConfig.changes.peek();
      content = contentChange.toCmsContent(this.content);
    }

    if (content.sent !== undefined && !publish) {
      ContentComponent.LOG.info('Content was already saved. Skipping save.');
      return Promise.resolve(content);
    } else if (this.userContent &&
               (
                 this.userContent.status === UserContentStatus.DRAFT_AWAITING_APPROVAL ||
                 this.userContent.status === UserContentStatus.APPROVED
               ) &&
               this.changeConfig.unsavedChanges === 0) {
      ContentComponent.LOG.info('Content was not changed. Skipping save.');
      return Promise.resolve(content);
    } else if (!content) {
      return Promise.reject(new Error('Unexpected state: nothing found to save'));
    } else {
      const results = this.validate();
      if (results.hasErrors()) {
        if (force) {
          results.highlight();
        }
        return Promise.reject(new Error('Content invalid'));
      }
    }

    ContentComponent.LOG.debug('Saving content...');
    this.setStatus(StatusKey.SAVE, StatusValue.IN_PROGRESS);
    window.clearTimeout(this.saveTimeoutId);
    this.saveTimeoutId = 0;
    if (contentChange) {
      contentChange.sent = new Date();
    }
    this.changeConfig.lastSentContent = content;
    this.changeConfig.isLastSaveDraft = !publish;
    const unsavedChangesBefore = this.changeConfig.unsavedChanges;

    return new Promise((resolve, reject) => {
      this.contentService.saveContent(!publish,
                                      content,
                          (cmsContent, userContent) => {
        ContentComponent.LOG.debug('Content successfully ' + (publish ? 'published' : 'saved') + '.');
        if (contentChange) {
          contentChange.stored = cmsContent.stored;
        }
        if (this.changeConfig.unsavedChanges === unsavedChangesBefore) {
          this.changeConfig.unsavedChanges = 0;
        }
        this.setStatus(StatusKey.SAVE, StatusValue.SUCCESSFUL);
        this.userContent = userContent;
        this.contentSave.emit(userContent);
        if (force) {
          this.notifications.showNotification(new Notification(
            this.translate.instant('toolbar.save.success_' + (publish ? 'publish' : 'draft')), // TODO use get
            null,
            NotificationType.success
          ));
        }
        resolve(content);
      }, (error, apiError) => {
        ContentComponent.LOG.warn('Failed to save content.');
        this.changeConfig.unsavedChanges = unsavedChangesBefore;
        if (contentChange) {
          contentChange.sent = undefined;
        }
        this.setStatus(StatusKey.SAVE, StatusValue.FAILED);
        reject(apiError.message);
      });
    });

  }

  /**
   * Register the given cms element type for insertion.
   * Handles calling #fillContentSlotForComponentInsert and toggling the
   * given button visually, as well as toggling layout.
   * @param type cms element type to insert
   * @param btn toolbar button that is associated with the element
   */
  private async addComponent(type: Type<unknown>, btn: ToolbarBtn) {
    if (this.addComponentBtn === btn) {
      this.contentService.viewMode = ViewMode.EDIT_LAYOUT;
      btn.data.active = false;
      this.addComponentType = undefined;
      this.addComponentBtn = undefined;
      await this.fillContentSlot();
      return;
    }
    if (this.addComponentBtn) {
      this.addComponentBtn.data.active = false;
    }
    btn.data.active = true;
    this.addComponentType = type;
    this.addComponentBtn = btn;
    await this.fillContentSlotForComponentInsert();
  }

  /**
   * Show the insert-component layout and
   * add drop zones between all components.
   */
  private async fillContentSlotForComponentInsert() {
    this.contentService.viewMode = ViewMode.INSERT_ELEMENT;

    this.contentSlot.clear();
    let i = 0;
    let cmp;
    cmp = this.contentSlot.createComponent(EditLayoutDropzoneComponent);
    cmp.instance.index = i;
    for (let el of this.elements) {
      await this.fillSlot(() => this.contentSlot, this.serializationService.serializeElement(el));
      cmp = this.contentSlot.createComponent(EditLayoutDropzoneComponent);
      cmp.instance.index = ++i;
    }

    this.update();
  }

  /**
   * Insert a new component to the content and return to
   * view mode EDIT_LAYOUT.
   * @param type type of component to instantiate
   * @param betweenIndex insert location (0 is before the first element, 1 between the first and second element, etc.)
   */
  public async insertNewComponent(type: Type<unknown>, betweenIndex: number) {
    let wrapperLayout = await this.fillSlot(() => this.contentSlot, BlockLayout, false, betweenIndex) as BlockLayout;
    this.elements.splice(betweenIndex, 0, wrapperLayout);
    this.cdRef.detectChanges();
    wrapperLayout.slotMainElement.set(await wrapperLayout.fillSlot(() => wrapperLayout.slotMain, type));
    this.trackChange(false, true);
    this.addComponentType = undefined;
    this.addComponentBtn.data.active = false;
    this.addComponentBtn = undefined;
    this.contentService.viewMode = ViewMode.EDIT_LAYOUT;
    await this.fillContentSlot();
  }

  onElementAdd(element: CmsElement): void {
    super.onElementAdd(element);
    this.subs.register(
      element.onChanged().subscribe(e => {
        this.changeConfig.hasUntrackedChange = true;
        this.trackChange();
        this.saveContent();
      })
    );
  }

  insertElement(index: number): void {
    timer(350).pipe(take(1)).subscribe(() => {
      this.insertNewComponent(this.addComponentType, index).then(value => {
        this.update();
      });
    });
  }

  removeElement(el: CmsElement): void {
    this.elements.splice(this.elements.indexOf(el), 1);
    this.trackChange(false, true);
    this.fillContentSlot();
  }

  private undo(backwards: boolean): void {
    if (backwards && this.changeConfig.hasUntrackedChange && this.changeConfig.changes.newerEntriesAmount() === 0) {
      this.trackChange(false, false);
    }
    const content = this.changeConfig.changes.pop(backwards ? 0 : 2);
    this.changeConfig.hasUntrackedChange = backwards;
    if (!content) {
      return;
    }
    this.fillContentSlot(content.content.elements);
  }

  public onSaved(): Observable<UserContent> {
    return this.contentSave.asObservable();
  }

  /**
   * Validate all elements in #elements
   * and return results.
   */
  public validate(): CmsValidationResults {
    const results = new CmsValidationResults();
    this.elements.forEach(e => {
      e.validate(results);
    });
    return results;
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
    if ((
          this.contentService.userContent.status === UserContentStatus.DRAFT_AWAITING_APPROVAL ||
          this.contentService.userContent.status === UserContentStatus.APPROVED
        ) &&
        this.changeConfig.unsavedChanges === 0) {
      this.viewMode = ViewMode.CONTENT;
      return;
    }
    this.closeBtnTooltip.hide();
    this.closeBtnPopover.show();
  }

  /**
   * Discard draft.
   */
  public discard(): void {
    // TODO await saving
    if (!this.changeConfig.lastStoredContent || (this.changeConfig.lastStoredContent && !this.changeConfig.lastStoredContent.isDraft)) {
      this.viewMode = ViewMode.CONTENT;
      this.toolbar.reset();
      this.reloadContent.emit();
      return;
    }
    this.setStatus(StatusKey.DISCARD_DRAFT, StatusValue.IN_PROGRESS);
    this.contentService.deleteContent(
      this.contentService.content.historyId,
      true,
      () => {
        this.setStatus(StatusKey.DISCARD_DRAFT, StatusValue.SUCCESSFUL);
        this.notifications.showNotification(new Notification(
          this.translate.instant('toolbar.close.discard_notification_success'),
          null,
          NotificationType.success
        ));
        this.viewMode = ViewMode.CONTENT;
        this.toolbar.reset();
        this.reloadContent.emit();
      },
      (error, apiError) => {
        this.setStatus(StatusKey.DISCARD_DRAFT, StatusValue.FAILED, apiError);
      });
  }

  /**
   * Save the current content as draft
   * and display the content without editing UI.
   */
  public save(): void {
    this.saveContent(true).then(value => {
      this.contentService.viewMode = ViewMode.CONTENT;
      this.toolbar.reset();
    }).catch(reason => {
      ContentComponent.LOG.error(reason);
    }).finally(() => {
      this.closeBtnPopover.hide();
      this.cdRef.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.saveContent(true, false).finally(() => {
      this.subs.unsubAll();
      window.clearTimeout(this.saveTimeoutId);
    });
  }

  set userContent(userContent: UserContent) {
    this.contentService.userContent = userContent;
  }

  get userContent(): UserContent {
    return this.contentService.userContent;
  }

  set content(content: CmsContent) {
    this.contentService.content = content;
  }

  get content(): CmsContent {
    return this.contentService.content;
  }

  private onViewModeChange(viewMode: ViewMode) {
    if (this.elements.length === 0 && viewMode === ViewMode.EDIT_CONTENT) {
      this.contentService.viewMode = ViewMode.EDIT_LAYOUT;
    }
    this.viewModeChange.emit(viewMode);
  }

  async deserialize(data: any): Promise<void> {
    throw new Error('deserialize() is not supported');
  }

  getName(): string {
    throw new Error('getName() is not supported');
  }

  serialize(): any {
    throw new Error('serialize() is not supported');
  }

}

export enum StatusKey {

  SAVE,
  DISCARD_DRAFT

}

export enum StatusValue {

  NONE,
  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
