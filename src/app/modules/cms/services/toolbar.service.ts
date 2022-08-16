import {Injectable, Type} from '@angular/core';
import {Log} from '../../shared/services/log.service';
import {ToolbarBtn, ToolbarElement, ToolbarSection} from '../entities/toolbar.entity';
import {CmsComponent} from '../interfaces/cms-component.interface';
import {CmsElementDescriptor} from '../entities/cms-element-map.entity';
import {CmsElement} from '../interfaces/cms-element.interface';
import {ContentService} from './content.service';
import {Observable, Subject} from 'rxjs';
import {SubscriptionManagerService} from '../../trees/services/subscription-manager.service';

/**
 * Handles communication of toolbar content from CMS elements
 * to the main content-component.
 *
 * @author Laurenz Fiala
 * @since 2020/10/10
 */
@Injectable({
  providedIn: 'root'
})
export class ToolbarService {

  private static LOG: Log = Log.newInstance(ToolbarService);

  private components = new Map<Type<unknown>, ToolbarSection<ToolbarBtn>>();
  private layouts = new Map<Type<unknown>, ToolbarSection<ToolbarBtn>>();
  private elementsContextual = new Set<CmsElement>();
  private activeComponent: CmsComponent;

  /**
   * Subject used to instruct toolbar component to update itself.
   */
  private updateSubject: Subject<void> = new Subject<void>();

  constructor(private contentService: ContentService,
              private subs: SubscriptionManagerService) {
  }

  /**
   * Register the given components' static toolbar sections
   * (used to create new components).
   * @param component components to add to the toolbar
   * @param layouts layouts to add to the toolbar
   */
  public registerStatic(components: Array<CmsElementDescriptor>, layouts: Array<CmsElementDescriptor>) {

    components.forEach(value => {
      this.components.set(value.type, value.toolbarSection);
    });
    layouts.forEach(value => {
      this.layouts.set(value.type, value.toolbarSection);
    });

  }

  /**
   * Register an element instance with the toolbar.
   * For now, only components are actually used.
   */
  public register(element: CmsElement) {

    this.elementsContextual.add(element);

    if (!this.contentService.isComponent(element)) {
      return;
    }

    element.onChanged().subscribe(comp => {
      this.updateSubject.next();
    });
    element.onFocus().subscribe(comp => {
      this.activeComponent = comp;
      this.updateSubject.next();
    });

  }

  /**
   * De-register an element instance from the toolbar.
   * This should be called in the elements' ngOnDestroy-method.
   */
  public deregister(element: CmsElement) {
    this.elementsContextual.delete(element);
  }

  public getComponents(): Array<ToolbarSection<ToolbarBtn>> {
    return Array.from(this.components.values());
  }

  public getLayouts(): Array<ToolbarSection<ToolbarBtn>> {
    return Array.from(this.layouts.values());
  }

  public getContextual(): ToolbarSection<ToolbarElement> {
    return this.activeComponent?.getToolbarContextual();
  }

  get onUpdate(): Observable<void> {
    return this.updateSubject.asObservable();
  }

  public update(): void {
    this.updateSubject.next();
  }

  public reset(): void {
    this.activeComponent = undefined;
  }

}
