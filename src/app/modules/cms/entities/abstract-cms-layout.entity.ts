import {CmsComponent} from '../interfaces/cms-component.interface';
import {CmsLayout} from '../interfaces/cms-layout.interface';
import {CmsLayoutSlot} from './layout-slot.entity';
import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  OnDestroy,
  OnInit,
  ViewContainerRef
} from '@angular/core';
import {SerializedCmsElement} from './serialized-cms-element.entity';
import {ToolbarService} from '../services/toolbar.service';
import {ContentService} from '../services/content.service';
import {CmsElement} from '../interfaces/cms-element.interface';
import {AbstractComponent} from '../../shared/components/abstract.component';
import {Observable, Subject} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';
import {CmsValidationResults} from './cms-validation-results.entity';

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

  protected abstract contentService: ContentService;
  protected abstract toolbar: ToolbarService;
  protected abstract cdRef: ChangeDetectorRef;
  protected abstract resolver: ComponentFactoryResolver;

  private _onAfterViewInit = new Subject<void>();
  private onChangedSubject: Subject<CmsLayout>;

  constructor() {
    super();
    this.onChangedSubject = new Subject<CmsLayout>();
  }

  public ngOnInit() {
    this.toolbar.register(this);
  }

  /**
   * Resolves all queued-up promises for
   * filling layout slots.
   */
  public ngAfterViewInit() {
    this._onAfterViewInit.complete();
  }

  public ngOnDestroy() {
    this.toolbar.deregister(this);
  }

  protected async onAfterViewInit(): Promise<void> {
    return this._onAfterViewInit.toPromise();
  }

  /**
   * Update this component and children using the component's ChangeDetectorRef.
   */
  protected update(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Fill the given slot with new instance(s) of serializedElement.
   * The slot is cleared before appending the given serializedElements.
   * @param slotGetter function that returns the slot as ViewContainerRef
   * @param serializedElements elements to deserialize into the given slot
   * @returns Promise, resolved when all given serilaized elements are
   *          deserialized and added to the slot.
   */
  protected async fillSlotMultiple(slotGetter: () => ViewContainerRef,
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
   * Fill the given slot with new instance of serializedElement.
   * @param slotGetter function that returns the slot as ViewContainerRef
   * @param serializedElement element to deserialize into the given slot
   * @param clear pass true to clear the slot before filling it (default false)
   * @returns Promise, resolved when all given serilaized elements are
   *          deserialized and added to the slot.
   */
  protected async fillSlot(slotGetter: () => ViewContainerRef,
                           serializedElement: SerializedCmsElement,
                           clear: boolean = false): Promise<CmsElement> {

    if (!serializedElement) {
      return Promise.reject();
    }

    await this.onAfterViewInit();

    const slot = slotGetter();
    if (clear) {
      slot.clear();
    }
    const elementType = this.contentService.getElement(serializedElement.getName());
    const componentFactory = this.resolver.resolveComponentFactory(elementType);
    const componentRef = slot.createComponent(componentFactory);
    const element = <CmsElement> componentRef.instance;

    element.deserialize(serializedElement);
    this.contentService.elementAdd(element);

    return Promise.resolve(element);

  }

  public getElementType(): ElementType {
    return ElementType.LAYOUT;
  }

  public changed(): void {
    this.onChangedSubject.next(this);
  }

  public onChanged(): Observable<CmsLayout> {
    return this.onChangedSubject.asObservable();
  }

  /**
   * Returns true if the service signals that this
   * layout should display itself in layout mode.
   */
  public isEditLayout(): boolean {
    return this.contentService.viewMode === ViewMode.EDIT_LAYOUT;
  }

  // --- CmsElement / CmsLayout ---
  onElementAdd(slot: CmsLayoutSlot, component: CmsComponent): void {}
  onElementRemove(component: CmsComponent): void {}
  abstract getName(): string;
  abstract serialize(): any;
  abstract deserialize(data: any): void;
  abstract validate(results: CmsValidationResults): void;

}
