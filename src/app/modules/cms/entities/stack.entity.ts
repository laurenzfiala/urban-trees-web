import {CmsComponent} from '../interfaces/cms-component.interface';
import {CmsValidationResult} from './cms-validation-result.entities';
import {Directive, OnDestroy, OnInit} from '@angular/core';
import {AbstractComponent} from '../../trees/components/abstract.component';
import {ToolbarElement, ToolbarSection} from './toolbar.entity';
import {Observable, Subject} from 'rxjs';
import {ElementType} from '../enums/cms-element-type.enum';
import {ToolbarService} from '../services/toolbar.service';

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

  private onFocusSubject: Subject<CmsComponent>;
  private onFocusOutSubject: Subject<CmsComponent>;
  private onChangedSubject: Subject<CmsComponent>;

  protected toolbar: ToolbarService;

  public ngOnInit() {
    this.onFocusSubject = new Subject<CmsComponent>();
    this.onFocusOutSubject = new Subject<CmsComponent>();
    this.onChangedSubject = new Subject<CmsComponent>();
    this.toolbar.register(this);
  }

  public ngOnDestroy() {
    this.toolbar.deregister(this);
  }

  public focus(): void {
    this.onFocusSubject.next(this);
  }

  public onFocus(): Observable<CmsComponent> {
    return this.onFocusSubject;
  }

  public focusOut(): void {
    this.onFocusOutSubject.next(this);
  }

  public onFocusOut(): Observable<CmsComponent> {
    return this.onFocusOutSubject.asObservable();
  }

  public onChanged(): Observable<CmsComponent> {
    return this.onChangedSubject.asObservable();
  }

  public getElementType(): ElementType {
    return ElementType.COMPONENT;
  }

  // --- CmsElement / CmsComponent ---
  abstract serialize(): any;
  abstract deserialize(data: any): void;
  abstract getName(): string;
  abstract validate(): Array<CmsValidationResult>;
  abstract getToolbarContextual(): ToolbarSection<ToolbarElement>;

}
