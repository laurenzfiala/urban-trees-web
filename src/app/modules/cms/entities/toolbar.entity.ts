import {Observable, Subject} from 'rxjs';
import {CmsComponent} from '../interfaces/cms-component.interface';

/**
 * A group of toolbar elements belonging to a component.
 */
export class ToolbarSection<T extends ToolbarElement> {

  public readonly elements: Array<T>;

  constructor(...elements: Array<T>) {
    this.elements = elements;
  }

}

/**
 * A single (abstract) element in a toolbar section.
 * This may be a ToolbarBtn or something similar, like an input etc.
 */
export abstract class ToolbarElement {

  public readonly description: string;

  constructor(description: string) {
    this.description = description;
  }

}

/**
 * A single button to display in the toolbar
 * with an associated action handled by the corresponding component.
 */
export class ToolbarBtn extends ToolbarElement {

  public readonly name: string;
  public readonly iconPath: string;
  public readonly actionSubject: Subject<any>;

  constructor(name: string,
              description: string,
              iconPath: string) {
    super(description);
    this.name = name;
    this.iconPath = iconPath;
  }

  public actionObservable(): Observable<any> {
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

  public readonly selectedKey: string;
  private readonly options: Map<string, any> = new Map<string, any>();
  private readonly changedSubject: Subject<any>;

  constructor(description: string, selectedKey: string, options: Map<string, any>) {
    super(description);
    this.selectedKey = selectedKey;
    this.options = options;
  }

  public changedObservable(): Observable<any> {
    return this.changedSubject.asObservable();
  }

  public onChanged() {
    this.changedSubject.next(this.options.get(this.selectedKey));
  }

}
