import {Observable, Subject} from 'rxjs';
import {CmsComponent} from '../interfaces/cms-component.interface';

/**
 * Holds all elements to show inside the toolbar.
 */
export class Toolbar {

  private components: Map<string, ToolbarSection<ToolbarBtn>> = new Map<string, ToolbarSection<ToolbarBtn>>();
  private contextual: Map<string, ToolbarSection<ToolbarElement>> = new Map<string, ToolbarSection<ToolbarElement>>();

  /**
   * Register the given component's static toolbar section
   * (used to create new components).
   * @param component component to register
   */
  public register(component: CmsComponent) {
    this.components.set(component.getComponentName(), component.getToolbarSection());
  }

  /**
   * Update the given component's contextual toolbar section
   * (used for component-internal actions).
   * @param component component's contextual toolbar to update
   */
  public update(component: CmsComponent) {
    this.contextual.set(component.getComponentName(), component.getToolbarContextual());
  }

  public getComponents(): Array<ToolbarSection<ToolbarBtn>> {
    return Array.from(this.components.values());
  }

  public getContextual(): Array<ToolbarSection<ToolbarElement>> {
    return Array.from(this.contextual.values());
  }

}

/**
 * A group of toolbar elements belonging to a component.
 */
export class ToolbarSection<T extends ToolbarElement> {

  private elements: Array<T>;

  constructor(...elements: Array<T>) {
    this.elements = elements;
  }

  public getElements(): Array<T> {
    return this.elements;
  }

}

/**
 * A single (abstract) element in a toolbar section.
 * This may be a ToolbarBtn or something similar, like an input etc.
 */
export abstract class ToolbarElement {

  private description: string;

  constructor(description: string) {
    this.description = description;
  }

  public getDescription(): string {
    return this.description;
  }

}

/**
 * A single button to display in the toolbar
 * with an associated action handled by the corresponding component.
 */
export class ToolbarBtn extends ToolbarElement {

  private name: string;
  private iconPath: string;
  private actionSubject: Subject<any>;

  constructor(name: string,
              description: string,
              iconPath: string) {
    super(description);
    this.name = name;
    this.iconPath = iconPath;
  }

  public getName(): string {
    return this.name;
  }

  public getIconPath(): string {
    return this.iconPath;
  }

  public getActionObservable(): Observable<any> {
    return this.actionSubject.asObservable();
  }

  public onAction() {
    this.actionSubject.next();
  }

}

/**
 * A single dropdown to display in the toolbar.
 * Action is triggered when the value changes.
 */
export class ToolbarDropdown extends ToolbarElement {

  public currentValue: string;
  private values: Map<string, any> = new Map<string, any>();
  private changedSubject: Subject<any>;

  constructor(description: string, currentValue: string, values: Map<string, any>) {
    super(description);
    this.currentValue = currentValue;
    this.values = values;
  }

  public getChangedObservable(): Observable<any> {
    return this.changedSubject.asObservable();
  }

  public onChanged() {
    this.changedSubject.next(this.values.get(this.currentValue));
  }

}
