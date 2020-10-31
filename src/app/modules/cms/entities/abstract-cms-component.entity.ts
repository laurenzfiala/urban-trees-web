import {CmsComponent} from '../interfaces/cms-component.interface';
import {CmsLayout} from '../interfaces/cms-layout.interface';
import {CmsLayoutSlot} from './layout-slot.entity';
import {CmsValidationResult} from './cms-validation-result.entities';
import {ViewMode} from '../enums/cms-layout-view-mode.entity';
import {ChangeDetectorRef, ComponentFactoryResolver, ViewContainerRef} from '@angular/core';
import {SerializedCmsElement} from './serialized-cms-element.entity';
import {ToolbarService} from '../services/toolbar.service';
import {ContentService} from '../services/content.service';
import {CmsElement} from '../interfaces/cms-element.interface';
import {AbstractComponent} from '../../trees/components/abstract.component';

/**
 * Abstract CMS layout with important logic and helpers for layouts.
 *
 * @author Laurenz Fiala
 * @since 2020/10/10
 */
export abstract class AbstractCmsLayout extends AbstractComponent implements CmsLayout {

  protected abstract contentService: ContentService;
  protected abstract toolbar: ToolbarService;
  protected abstract cdRef: ChangeDetectorRef;
  protected abstract resolver: ComponentFactoryResolver;

  /**
   * Update this component and children using the component's ChangeDetectorRef.
   */
  protected update(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Fill the given slot with a new instance of serializedElement.
   * @param serializedElement SerializedCmsElement
   * @param slot Template location to fill.
   * @param clear default = true; set to false to append to slot-ViewContainerRef
   * @return The just-initialized CmsComponent instance.
   */
  protected fillSlot(serializedElement: SerializedCmsElement,
                     slot: ViewContainerRef,
                     clear: boolean = true): CmsElement {

    if (clear) {
      slot.clear();
    }
    const elementType = this.contentService.getElement(serializedElement.getName());
    const componentFactory = this.resolver.resolveComponentFactory(elementType);
    const componentRef = slot.createComponent(componentFactory);
    const element = <CmsElement> componentRef.instance;

    element.deserialize(serializedElement.getData());

    // NOTE: for now this is assumed correct and intentional.
    this.toolbar.register(<CmsComponent> element);
    this.toolbar.update(<CmsComponent> element);

    return element;

  }

  // --- CmsLayout ---
  abstract deserialize(data: any): void;
  abstract getName(): string;
  abstract onComponentAdd(slot: CmsLayoutSlot, component: CmsComponent): void;
  abstract onComponentRemove(component: CmsComponent): void;
  abstract serialize(): any;
  abstract validate(): Array<CmsValidationResult>;
  abstract view(mode: ViewMode): void;

}
