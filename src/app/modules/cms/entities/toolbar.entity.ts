import {Observable, Subject} from 'rxjs';
import {ToolbarService} from '../services/toolbar.service';

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

  public readonly description: string | Observable<string>;

  constructor(description: string | Observable<string>) {
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

  public readonly name: string | Observable<string>;
  public readonly iconPath: string;
  public readonly actionSubject: Subject<ToolbarBtn>;
  public data: any;
  public element!: HTMLButtonElement;

  constructor(name: string | Observable<string>,
              description: string | Observable<string>,
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
   * @param element the buttons' current html element for access to state
   */
  public action(element: HTMLButtonElement) {
    this.element = element;
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
 * A single toggle button to display in the toolbar
 * with an associated action handled by the corresponding component.
 * TODO
 */
export class ToolbarToggleBtn extends ToolbarBtn {

  public active: boolean;

  constructor(name: string | Observable<string>,
              description: string | Observable<string>,
              iconPath: string,
              data: any = {}) {
    super(name, description, iconPath, data);
    this.active = false;
  }

  public action(element: HTMLButtonElement) {
    this.active = !this.active;
    super.action(element);
  }

}

/**
 * A single dropdown to display in the toolbar.
 * Action is triggered when the value changes.
 */
export class ToolbarDropdown extends ToolbarElement {

  public selectedValue: any;
  private readonly options: Map<string | Observable<string>, any> = new Map<string | Observable<string>, any>();
  private readonly changedSubject: Subject<any>;

  constructor(description: string | Observable<string>,
              selectedValue: any,
              options: Map<string | Observable<string>, any>) {
    super(description);
    this.selectedValue = selectedValue;
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

  public changed(selectedValue: any) {
    this.selectedValue = selectedValue;
    this.changedSubject.next(selectedValue);
  }

  public setValueOn(observable: Observable<any>, toolbarService: ToolbarService): ToolbarDropdown {
    observable.subscribe(value => {
      this.selectedValue = value;
      toolbarService.update();
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
