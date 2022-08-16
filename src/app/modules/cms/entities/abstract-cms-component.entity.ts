import {CmsComponent} from '../interfaces/cms-component.interface';
import {ChangeDetectorRef, Directive, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../shared/components/abstract.component';
import {ToolbarElement, ToolbarSection} from './toolbar.entity';
import {BehaviorSubject, Observable, ReplaySubject, Subject} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {ToolbarService} from '../services/toolbar.service';
import {CmsValidationResults} from './cms-validation-results.entity';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';
import {ContentService} from '../services/content.service';
import {CmsElement} from '../interfaces/cms-element.interface';
import {map} from 'rxjs/operators';

/**
 * Abstract CMS component with important logic and helpers for components.
 *
 * Note: this is declared a directive, because Angular, for some reason, wants classes that
 *       implement their interfaces to be Angular components or directives.
 *       see https://github.com/angular/angular/issues/35367#issuecomment-585136872
 *
 * @author Laurenz Fiala
 * @since 2020/10/10
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class AbstractCmsComponent
  extends AbstractComponent
  implements CmsComponent, OnInit, OnDestroy {

  ViewMode = ViewMode;

  protected abstract contentService: ContentService;

  private onDestroySubject: ReplaySubject<CmsComponent>;
  private onFocusSubject: Subject<CmsComponent>;
  private onFocusOutSubject: Subject<CmsComponent>;
  private onChangedSubject: Subject<CmsComponent>;

  protected abstract toolbar: ToolbarService;
  protected abstract cdRef: ChangeDetectorRef;

  constructor() {
    super();
    this.onDestroySubject = new ReplaySubject<CmsComponent>();
    this.onFocusSubject = new Subject<CmsComponent>();
    this.onFocusOutSubject = new Subject<CmsComponent>();
    this.onChangedSubject = new Subject<CmsComponent>();
  }

  public ngOnInit() {
    this.toolbar.register(this);
  }

  /**
   * Update this component and children using the component's ChangeDetectorRef.
   */
  protected update(): void {
    this.cdRef.detectChanges();
  }

  public ngOnDestroy() {
    this.toolbar.deregister(this);
    this.onDestroySubject.next(this);
    this.onDestroySubject.complete();
  }

  protected async onDestroy(): Promise<void> {
    const promise = new Promise<void>(resolve => {
      this.onDestroySubject.subscribe(() => {
        resolve();
      });
    });
    return promise;
  }

  public focus(): void {
    this.onFocusSubject.next(this);
  }

  public onFocus(): Observable<CmsComponent> {
    return this.onFocusSubject.asObservable();
  }

  public focusOut(): void {
    this.onFocusOutSubject.next(this);
  }

  public onFocusOut(): Observable<CmsComponent> {
    return this.onFocusOutSubject.asObservable();
  }

  public changed(): void {
    this.onChangedSubject.next(this);
  }

  public onChanged(): Observable<CmsComponent> {
    return this.onChangedSubject;
  }

  public getElementType(): ElementType {
    return ElementType.COMPONENT;
  }

  public addUpdater(observable: Observable<CmsElement>) {
    observable.subscribe(value => {
      this.cdRef.markForCheck();
    });
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

  // --- CmsElement / CmsComponent ---
  abstract serialize(): any;
  abstract deserialize(data: any): Promise<void>;
  abstract getName(): string;
  abstract validate(results: CmsValidationResults): void;
  abstract getToolbarContextual(): ToolbarSection<ToolbarElement>;

}
