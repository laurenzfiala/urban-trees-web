import {Type} from '@angular/core';
import {ToolbarBtn, ToolbarSection} from './toolbar.entity';
import {PartialObserver} from 'rxjs';

/**
 * CMS element map that holds the mapping from element names
 * to their static descriptors.
 *
 * @author Laurenz Fiala
 * @since 2020/10/14
 */
export class CmsElementMap {

  /**
   * Map holds element descriptors.
   */
  private readonly elements: Map<string, CmsElementDescriptor>;

  constructor(elements: Map<string, CmsElementDescriptor> = new Map<string, CmsElementDescriptor>()) {
    this.elements = elements;
  }

  public set(serializedElementName: string, element: CmsElementDescriptor): CmsElementMap {
    this.elements.set(serializedElementName, element);
    return this;
  }

  public get(serializedElementName: string): CmsElementDescriptor {
    return this.elements.get(serializedElementName);
  }

  public getAll(): Map<string, CmsElementDescriptor> {
    return this.elements;
  }

  public getAllNames(): Array<string> {
    return [...this.elements.keys()];
  }

  public getAllTypes(): Array<Type<unknown>> {
    return [...this.elements.values()].map(value => value.type);
  }

  public getAllDescriptors(): Array<CmsElementDescriptor> {
    return [...this.elements.values()];
  }

  /**
   * Combines all given element maps into one and returns it.
   * The resulting element map has all entries from the given maps, in order.
   * May contain duplicate mappings.
   * @param maps element maps to combine into one
   */
  public static combine(...maps: Array<CmsElementMap>): CmsElementMap {
    const result = new Map<string, CmsElementDescriptor>();
    maps.forEach(map => {
      map.getAll().forEach((value, key) => {
        result.set(key, value);
      });
    });
    return new CmsElementMap(result);
  }

}

/**
 * Holds static information on CMS elements
 * like type and their toolbar section.
 */
export class CmsElementDescriptor {

  /**
   * Type of the element.
   */
  private _type: Type<unknown>;

  /**
   * Defines the sttaic toolbar for this element.
   */
  private _toolbarSection: ToolbarSection<ToolbarBtn>;

  constructor(type?: Type<unknown>, toolbarSection?: ToolbarSection<ToolbarBtn>) {
    this._type = type;
    this._toolbarSection = toolbarSection;
  }

  get type(): Type<unknown> {
    return this._type;
  }

  set type(value: Type<unknown>) {
    this._type = value;
  }

  get toolbarSection(): ToolbarSection<ToolbarBtn> {
    return this._toolbarSection;
  }

  set toolbarSection(value: ToolbarSection<ToolbarBtn>) {
    this._toolbarSection = value;
  }

}

/**
 * This is a factory class used to build
 * a CmsElementDescriptor.
 */
export class EDBuilder {

  private readonly descriptor: CmsElementDescriptor;

  constructor() {
    this.descriptor = new CmsElementDescriptor();
  }

  public type(value: Type<unknown>): EDBuilder {
    this.descriptor.type = value;
    return this;
  }

  public toolbarBtn(name: string, description: string, iconPath: string): EDToolbarBtnBuilder {

    if (!this.descriptor.toolbarSection) {
      this.descriptor.toolbarSection = new ToolbarSection<ToolbarBtn>();
    }
    const btn = new ToolbarBtn(
      name,
      description,
      iconPath
    );
    this.descriptor.toolbarSection.elements.push(btn);
    return new EDToolbarBtnBuilder(this, btn);

  }

  public build(): CmsElementDescriptor {
    return this.descriptor;
  }

  public static new(): EDBuilder {
    return new EDBuilder();
  }

}

/**
 * This is a factory class used to build
 * a CmsElementDescriptor.
 */
export class EDToolbarBtnBuilder {

  constructor(private parent: EDBuilder,
              private btn: ToolbarBtn) {}

  /**
   * Subscribes to the toolbar buttons' action
   * and returns the parent builder.
   * @param observer observer which gets the updates
   * @param subscription created subscription (to enable unsubscribing)
   */
  public onAction(observer: PartialObserver<any>, subscription: (Subscription) => void): EDBuilder {
    subscription(this.btn.actionObservable().subscribe(observer));
    return this.parent;
  }

}
