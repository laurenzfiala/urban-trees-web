import {Type} from '@angular/core';
import {CmsElement} from '../interfaces/cms-element.interface';
import {ToolbarBtn, ToolbarSection} from './toolbar.entity';

/**
 * TODO
 */
export class CmsElementMap<T extends CmsElement> {

  /**
   * TODO
   */
  private elements = new Map<string, CmsElementDescriptor>();

  constructor(elements?: Map<string, CmsElementDescriptor>) {
    this.elements = elements;
  }

  public set(serializedElementName: string, element: CmsElementDescriptor): CmsElementMap<T> {
    this.elements.set(serializedElementName, element);
    return this;
  }

  public get(serializedElementName: string): CmsElementDescriptor {
    return this.elements.get(serializedElementName);
  }

  public getAll(): Map<string, CmsElementDescriptor> {
    return this.elements;
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
  public static combine(...maps: Array<CmsElementMap<CmsElement>>): CmsElementMap<CmsElement> {
    const result = new Map<string, CmsElementDescriptor>();
    maps.forEach(map => {
      map.getAll().forEach((value, key) => {
        result.set(key, value);
      });
    });
    return new CmsElementMap<CmsElement>(result);
  }

}

/**
 * TODO
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

  constructor(type: Type<unknown>, toolbarSection: ToolbarSection<ToolbarBtn>) {
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
 * TODO
 */
export class CmsElDescBuilder {

  private descriptor: CmsElementDescriptor;

  public type(value: Type<unknown>): CmsElDescBuilder {
    this.descriptor.type = value;
    return this;
  }

  public toolbarBtn(name: string, description: string, iconPath: string): CmsElDescBuilder {
    this.descriptor.toolbarSection = new ToolbarSection<ToolbarBtn>(
      new ToolbarBtn(
        name,
        description,
        iconPath
      )
    );
    return this;
  }

  public build(): CmsElementDescriptor {
    return this.descriptor;
  }

  public static new(): CmsElDescBuilder {
    return new CmsElDescBuilder();
  }

}
