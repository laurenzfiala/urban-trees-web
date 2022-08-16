import {Observable, Subject} from 'rxjs';

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

  /**
   * The toolbar element unsubscribes from all pending
   * subscriptions when the given promise completes.
   * @param promise shut the toolbar el down when this fires
   */
  abstract destroyOn(promise: Promise<void>): ToolbarElement;

}

/**
 * A single button to display in the toolbar
 * with an associated action handled by the corresponding component.
 */
export class ToolbarBtn extends ToolbarElement {

  public readonly name: string;
  public readonly iconPath: string;
  public readonly actionSubject: Subject<ToolbarBtn>;
  public data: any;

  constructor(name: string,
              description: string,
              iconPath: string,
              data: any = {}) {
    super(description);
    this.name = name;
    this.iconPath = iconPath;
    this.actionSubject = new Subject<ToolbarBtn>();
    this.data = data;
  }

  public onAction(): Observable<any> {
    return this.actionSubject.asObservable();
  }

  public setAction(onAction: (value: any) => void): ToolbarBtn {
    this.actionSubject.subscribe(onAction);
    return this;
  }

  /**
   * Notify all observers that this buttons'
   * action should be executed and pass self.
   */
  public action() {
    this.actionSubject.next(this);
  }

  public destroyOn(promise: Promise<void>): ToolbarBtn {
    promise.then(value => {
      this.actionSubject?.complete();
    });
    return this;
  }

}

/**
 * A single dropdown to display in the toolbar.
 * Action is triggered when the value changes.
 */
export class ToolbarDropdown extends ToolbarElement {

  public selectedKey: any;
  private readonly options: Map<string, any> = new Map<string, any>();
  private readonly changedSubject: Subject<any>;

  constructor(description: string, selectedKey: any, options: Map<string, any>) {
    super(description);
    this.selectedKey = selectedKey;
    this.options = options;
    this.changedSubject = new Subject<any>();
  }

  public onChanged(): Observable<any> {
    return this.changedSubject.asObservable();
  }

  public setChange(onChange: (value: any) => void): ToolbarDropdown {
    this.changedSubject.subscribe(onChange);
    return this;
  }

  public changed() {
    this.changedSubject.next(this.selectedKey);
  }

  public setValueOn(observable: Observable<any>): ToolbarDropdown {
    observable.subscribe(value => {
      this.selectedKey = value;
    });
    return this;
  }

  public destroyOn(promise: Promise<void>): ToolbarDropdown {
    promise.then(value => {
      this.changedSubject?.complete();
    });
    return this;
  }

}
