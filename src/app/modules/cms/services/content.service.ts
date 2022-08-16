import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {ApiError} from '../../shared/entities/api-error.entity';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {CmsElementMap} from '../entities/cms-element-map.entity';
import {CmsElement} from '../interfaces/cms-element.interface';
import {CmsComponent} from '../interfaces/cms-component.interface';
import {ElementType} from '../enums/cms-element-type.enum';
import {CmsLayout} from '../interfaces/cms-layout.interface';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {AuthService} from '../../shared/services/auth.service';
import {CmsContentContextRef} from '../entities/cms-content-context-ref.entity';
import {CmsContent} from '../entities/cms-content.entity';
import {UserContent} from '../entities/user-content.entity';
import {UserContentMetadata} from '../entities/user-content-metadata.entity';
import {ViewMode} from '../enums/cms-layout-view-mode.enum';
import {User} from '../../trees/entities/user.entity';

/**
 * Handles loading and saving of CMS content.
 * @author Laurenz Fiala
 * @since 2020/05/17
 */
@Injectable({
  providedIn: 'root'
})
export class ContentService extends AbstractService {

  private static LOG: Log = Log.newInstance(ContentService);

  /**
   * Content displayed by the content component
   * that this service is scoped to.
   */
  public content: CmsContent;

  /**
   * Holds the mapping from string to type for all cms
   * elements in the associated content component.
   */
  private elementMap: CmsElementMap;

  /**
   * Subject used to trigger updates in the content component.
   */
  private updateSubject: Subject<void> = new Subject<void>();

  /**
   * Subject used to notify content component that a new root-level
   * element has been dropped at a given location (index).
   */
  private elementDroppedSubject: Subject<number> = new Subject<number>();

  /**
   * Subject used to notify content component that a root-level
   * element is to be removed from the content.
   */
  private elementRemoveSubject: Subject<CmsElement> = new Subject<CmsElement>();

  /**
   * Subject used to instruct content component to undo/redo
   * an editing step.
   */
  private undoSubject: Subject<boolean> = new Subject<boolean>();

  /**
   * Subject used to notify content component (and parents)
   * of a change in view mode.
   */
  private viewModeChangeSubject: Subject<ViewMode>;

  /**
   * TODO
   */
  private contentPathSubject: BehaviorSubject<string>;

  /**
   * How to display the associated content.
   */
  private _viewMode: ViewMode;

  constructor(private authService: AuthService,
              private http: HttpClient,
              private envService: EnvironmentService) {
    super();
    this.viewModeChangeSubject = new BehaviorSubject<ViewMode>(this._viewMode);
  }

  public contentPath(): BehaviorSubject<string> {
    if (!this.contentPathSubject) {
      throw new Error('CMS element requested content path, but it was not set.');
    }
    return this.contentPathSubject;
  }

  /**
   * TODO
   * @param contentPath
   */
  public setContentPath(contentPath: string) {
    if (this.contentPathSubject) {
      this.contentPathSubject.next(contentPath);
    } else {
      this.contentPathSubject = new BehaviorSubject<string>(contentPath);
    }
  }

  /**
   * Load contents by id and language from the backend.
   * @param contentPath content path
   * @param contentLang content language to receive
   * @param successCallback called upon successful retrieval of the content
   * @param errorCallback called upon failed retrieval of the content
   */
  public loadContent(contentPath: string,
                     contentLang: string,
                     successCallback: (content: Array<UserContent>) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    ContentService.LOG.debug('Loading content at ' + contentPath + '...');
    this.http.get<Array<UserContent>>(this.envService.endpoints.loadContent(contentPath, contentLang))
      .map(contents => contents && contents.map(c => UserContent.fromObject(c, this.envService)))
      .subscribe((content: Array<UserContent>) => {
        ContentService.LOG.debug('Loaded content at ' + contentPath + ' successfully.');
        successCallback(content);
      }, (e: any) => {
        ContentService.LOG.error('Could not load content at ' + contentPath + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public loadCmsUserHistory(contentIdPrefix: string,
                            successCallback: (history: Array<UserContentMetadata>) => void,
                            errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    ContentService.LOG.debug('Loading user content history...');

    this.http.get<Array<UserContentMetadata>>(this.envService.endpoints.loadContentUserHistory(this.authService.getUserId(), contentIdPrefix))
      .map(list => list && list.map(h => UserContentMetadata.fromObject(h, this.envService)))
      .subscribe((h: Array<UserContentMetadata>) => {
        ContentService.LOG.debug('Loaded user content history successfully.');
        successCallback(h);
      }, (e: any) => {
        ContentService.LOG.error('Could not load user content history: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  public saveContentFile(contentPath: string,
                         file: File,
                         successCallback: (fileId: number) => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): Observable<number> {

    if (!file) {
      ContentService.LOG.debug('No content file given to save.');
      return;
    }

    const url = this.envService.endpoints.saveContentFile(contentPath);
    ContentService.LOG.debug('Saving content file at ' + contentPath + '...');

    let formdata: FormData = new FormData();
    formdata.append('file', file);

    let uploadProgressSubject = new Subject<number>();

    let uploadProgress = 0;
    this.http.post(url, formdata, {reportProgress: true, responseType: 'text'})
      .subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        uploadProgress = Math.round(100 * event.loaded / event.total);
        ContentService.LOG.info('Uploading content file: ' + uploadProgress + ' %');
        uploadProgressSubject.next(uploadProgress);
      } else {
        const fileId = Number.parseInt(event, 10);
        ContentService.LOG.info('Successfully uploaded content file with id ' + fileId + '.');
        successCallback(fileId);
        uploadProgressSubject.complete();
      }
    }, (e: any) => {
      ContentService.LOG.error('Could not upload content image: ' + e.error.message, e);
      if (errorCallback) {
        errorCallback(e, this.safeApiError(e));
      }
    });

    return uploadProgressSubject.asObservable();

  }

  /**
   * Save the given content for the given content id on the backend.
   * @param contentPath content path
   * @param contentLang language id of the content
   * @param isDraft whether the given content should be saved as draft or published
   * @param content serialized content to persist
   * @param successCallback called upon successful retrieval of the content
   * @param errorCallback called upon failed retrieval of the content
   */
  public saveContent(contentPath: string,
                     contentLang: string,
                     isDraft: boolean,
                     content: CmsContent,
                     successCallback: (cmsContent: CmsContent) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    const url = this.envService.endpoints.saveContent(contentPath, contentLang, isDraft);

    ContentService.LOG.debug('Saving content at ' + contentPath + '...');

    this.http.post<UserContent>(url, content.toJSONObject(this.envService))
      .subscribe((uc: UserContent) => {
        ContentService.LOG.debug('Saved content at ' + contentPath + ' successfully.');
        this.content = CmsContent.fromUserContent(uc, this.envService);
        this.content.historyId = uc.id;
        successCallback(content);
      }, (e: any) => {
        ContentService.LOG.error('Could not save content at ' + contentPath + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * TODO
   * @param contentId
   */
  public getContentContextRef(idRegex: RegExp, contentId: string): CmsContentContextRef<any> {
    return CmsContentContextRef.fromContentId(idRegex, contentId);
  }

  /**
   * Set the element map for this content service.
   * @param elementMap may not be null or undefined
   */
  public setElementMap(elementMap: CmsElementMap): void {
    this.elementMap = elementMap;
  }

  /**
   * @param elementName cms element name (see #getName())
   * @return type of the given CMS element, or null
   * @see CmsElementMap
   */
  public getElement(elementName: string): Type<unknown> {

    if (!this.elementMap) {
      ContentService.LOG.errorAndThrow('Element map not set');
    }
    return this.elementMap.get(elementName)?.type;

  }

  /**
   * Whether or not the given CMS element is a component or not.
   */
  public isComponent(element: CmsElement): element is CmsComponent {
    return element?.getElementType() === ElementType.COMPONENT;
  }

  /**
   * Whether or not the given CMS element is a layout or not.
   */
  public isLayout(element: CmsElement): element is CmsLayout {
    return element?.getElementType() === ElementType.LAYOUT;
  }

  /**
   * Update the content component.
   */
  public update() {
    return this.updateSubject.next();
  }

  /**
   * Returns an observable that triggers when (child)
   * components request an update.
   */
  public onUpdate() {
    return this.updateSubject.asObservable();
  }

  /**
   * Signal that a root-level element
   * requests removal from the content.
   */
  public elementRemove(element: CmsElement) {
    this.elementRemoveSubject.next(element);
  }

  /**
   * Returns an observable that triggers when
   * elements are slotted into a layout.
   */
  public onElementRemove() {
    return this.elementRemoveSubject.asObservable();
  }

  /**
   * Signal that a new root-level element has been dropped
   * into a drop zone.
   */
  public elementDropped(index: number) {
    this.elementDroppedSubject.next(index);
  }

  /**
   * Returns an observable that triggers when
   * root-level elements are dropped into a drop zone.
   */
  public onElementDropped() {
    return this.elementDroppedSubject.asObservable();
  }

  set viewMode(mode: ViewMode) {
    if (mode !== this._viewMode) {
      this._viewMode = mode;
      this.viewModeChangeSubject.next(mode);
    }
  }

  get viewMode(): ViewMode {
    return this._viewMode;
  }

  /**
   * Returns an observable that triggers when
   * the view mode changes.
   */
  public onViewModeChange(): Observable<ViewMode> {
    return this.viewModeChangeSubject;
  }

  public onUndo(): Observable<boolean> {
    return this.undoSubject.asObservable();
  }

  /**
   * TODO doc
   * @param backwards
   */
  public undo(backwards: boolean = true): void {
    this.undoSubject.next(backwards);
  }

}
