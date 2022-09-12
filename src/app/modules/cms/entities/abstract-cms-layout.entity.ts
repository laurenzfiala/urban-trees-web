import {CmsLayout} from '../interfaces/cms-layout.interface';
import {AfterViewInit, ChangeDetectorRef, Directive, OnDestroy, OnInit, Type, ViewContainerRef} from '@angular/core';
import {SerializedCmsElement} from './serialized-cms-element.entity';
import {ToolbarService} from '../services/toolbar.service';
import {ContentService} from '../services/content.service';
import {CmsElement} from '../interfaces/cms-element.interface';
import {AbstractComponent} from '../../shared/components/abstract.component';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';
import {CmsValidationResults} from './cms-validation-results.entity';
import {SubscriptionManagerService} from '../../trees/services/subscription-manager.service';

/**
 * Abstract CMS layout with important logic and helpers for layouts.
 *
 * @author Laurenz Fiala
 * @since 2020/10/10
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractCmsLayout
  extends AbstractComponent
  implements CmsLayout, OnInit, AfterViewInit, OnDestroy {

  ViewMode = ViewMode;

  protected abstract contentService: ContentService;
  protected abstract toolbar: ToolbarService;
  protected abstract subs: SubscriptionManagerService;
  protected abstract cdRef: ChangeDetectorRef;

  private _onAfterViewInit = new ReplaySubject<void>(1);
  private onChangedSubject: Subject<CmsElement>;
  private onUpdateSubject: Subject<CmsLayout>;

  public validationResults: CmsValidationResults = new CmsValidationResults();

  protected constructor() {
    super();
    this.onChangedSubject = new Subject<CmsElement>();
    this.onUpdateSubject = new Subject<CmsLayout>();
  }

  public ngOnInit() {
    this.toolbar.register(this);
  }

  /**
   * Resolves all queued-up promises for
   * filling layout slots.
   */
  public ngAfterViewInit() {
    this._onAfterViewInit.next();
  }

  public ngOnDestroy() {
    this.toolbar.deregister(this);
    this._onAfterViewInit.complete();
  }

  protected async onAfterViewInit(): Promise<void> {
    const promise = new Promise<void>(resolve => {
      this._onAfterViewInit.subscribe(() => {
        resolve();
      });
    });
    return promise;
  }

  /**
   * Update this component and children using the component's ChangeDetectorRef.
   */
  protected update(): void {
    this.cdRef.detectChanges();
    this.onUpdateSubject.next(this);
  }

  /**
   * Fill the given slot with new instance(s) of serializedElement.
   * The slot is cleared before appending the given serializedElements.
   * @param slotGetter function that returns the slot as ViewContainerRef
   * @param serializedElements elements to deserialize into the given slot
   * @returns Promise, resolved when all given serialized elements are
   *          deserialized and added to the slot.
   */
  public async fillSlotMultiple(slotGetter: () => ViewContainerRef,
                                ...serializedElements: Array<SerializedCmsElement>): Promise<Array<CmsElement>> {

    if (!serializedElements) {
      return Promise.reject();
    }

    await this.onAfterViewInit();

    const slot = slotGetter();
    slot.clear();

    const promises = [];
    for (let serializedElement of serializedElements) {
      promises.push(this.fillSlot(slotGetter, serializedElement));
    }

    return Promise.all(promises);

  }

  /**
   * Fill the given slot with new cms element instance.
   * @param slotGetter function that returns the slot as ViewContainerRef
   * @param typeOrSerializedEl type of empty element to create OR element to deserialize
   * @param clear (optional) pass true to clear the slot before filling it (default false)
   * @param index (optional) index at which to insert the element (default last)
   * @returns Promise, resolved when all given serialized elements are
   *          deserialized and added to the slot.
   */
  public async fillSlot(slotGetter: () => ViewContainerRef,
                        typeOrSerializedEl: Type<unknown> | SerializedCmsElement,
                        clear: boolean = false,
                        index?: number): Promise<CmsElement> {

    if (!typeOrSerializedEl) {
      return Promise.reject();
    }

    let type: Type<unknown>;
    let serializedElement: SerializedCmsElement;
    if (typeOrSerializedEl instanceof Type) {
      type = typeOrSerializedEl;
      serializedElement = undefined;
    } else if (typeOrSerializedEl instanceof SerializedCmsElement) {
      type = this.contentService.getElement(typeOrSerializedEl.getName());
      serializedElement = typeOrSerializedEl;
    } else {
      throw new Error('Invalid type given');
    }

    await this.onAfterViewInit();

    const slot = slotGetter();
    if (clear) {
      slot.clear();
    }
    const componentRef = slot.createComponent(type, {index});
    const element = <CmsElement> componentRef.instance;

    if (serializedElement !== undefined) {
      this.cdRef.detectChanges();
      await element.deserialize(serializedElement);
    }
    this.onElementAdd(element);

    return Promise.resolve(element);

  }

  public getElementType(): ElementType {
    return ElementType.LAYOUT;
  }

  public changed(el: CmsElement): void {
    this.onChangedSubject.next(el);
  }

  public onChanged(): Observable<CmsElement> {
    return this.onChangedSubject;
  }

  public addUpdater(observable: Observable<CmsElement>) {
    observable.subscribe(value => {
      this.update();
    });
  }

  public onElementAdd(element: CmsElement): void {
    element.onChanged().subscribe(el => {
      this.changed(el);
    }); // TODO sub
    element.addUpdater(this.onUpdateSubject);
  }

  /**
   * Shortcut to the content path subject provided by
   * ContentService.
   */
  public contentPath(): BehaviorSubject<string> {
    return this.contentService.contentPath();
  }

  /**
   * Returns true if the service signals that this
   * component should display itself in ANY of the
   * given view modes.
   * @param modes view modes: if ANY of these match, return true
   */
  public hasViewMode(...modes: ViewMode[]): boolean {
    return modes.includes(this.contentService.viewMode);
  }

  // --- CmsElement / CmsLayout ---
  onElementRemove(element: CmsElement): void {}
  abstract getName(): string;
  abstract serialize(): any;
  abstract deserialize(data: any): Promise<void>;
  abstract validate(results?: CmsValidationResults): CmsValidationResults;

}
