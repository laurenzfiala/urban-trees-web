import {CmsComponent} from '../interfaces/cms-component.interface';
import {CmsLayout} from '../interfaces/cms-layout.interface';
import {CmsLayoutSlot} from './layout-slot.entity';
import {CmsValidationResult} from './cms-validation-result.entities';
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
import {AbstractComponent} from '../../trees/components/abstract.component';
import {Observable, Subject} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';

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
   * Fill the given slot with a new instance of serializedElement.
   * @param serializedElement SerializedCmsElement (can be falsy)
   * @param slotPromise Template location to fill (promise). TODO doc
   * @param clear default = true; set to false to append to slot-ViewContainerRef
   * @return The (future) initialized CmsComponent instance.
   */
  protected async fillSlot(serializedElement: SerializedCmsElement,
                           slotGetter: () => ViewContainerRef,
                           clear: boolean = true): Promise<CmsElement> {

    if (!serializedElement) {
      return null;
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

    this.contentService.elementAdd(element);
    element.deserialize(serializedElement.getData());

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

  // --- CmsElement / CmsLayout ---
  onElementAdd(slot: CmsLayoutSlot, component: CmsComponent): void {}
  onElementRemove(component: CmsComponent): void {}
  abstract getName(): string;
  abstract serialize(): any;
  abstract deserialize(data: any): void;
  abstract validate(): Array<CmsValidationResult>;
  abstract view(mode: ViewMode): void;

}
