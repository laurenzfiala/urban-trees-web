import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../shared/entities/api-error.entity';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {SerializedCmsContent} from '../entities/serialized-cms-content.entity';
import {CmsElementMap} from '../entities/cms-element-map.entity';
import {CmsElement} from '../interfaces/cms-element.interface';
import {CmsComponent} from '../interfaces/cms-component.interface';
import {ElementType} from '../enums/cms-element-type.enum';
import {CmsLayout} from '../interfaces/cms-layout.interface';
import {Subject} from 'rxjs';

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
   * Holds the mapping from string to type for all cms
   * elements in the associated content component.
   */
  private elementMap: CmsElementMap<CmsElement>;

  /**
   * Subject used to trigger updates in the content component.
   */
  private updateSubject: Subject<void> = new Subject<void>();

  /**
   * Subject used to notify content component of new elements.
   */
  private elementAddSubject: Subject<CmsElement> = new Subject<CmsElement>();

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load a content by id from the backend.
   * @param contentId content identifier
   * @param successCallback called upon successful retrieval of the content
   * @param errorCallback called upon failed retrieval of the content
   */
  public loadContent(contentId: string,
                     successCallback: (content: SerializedCmsContent) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    ContentService.LOG.debug('Loading content with id ' + contentId + '...');
    this.http.get<SerializedCmsContent>(this.envService.endpoints.loadContent(contentId))
      .map(c => SerializedCmsContent.fromObject(c, this.envService))
      .subscribe((content: SerializedCmsContent) => {
        ContentService.LOG.debug('Loaded content with id ' + contentId + ' successfully.');
        successCallback(content);
      }, (e: any) => {
        ContentService.LOG.error('Could not load content with id ' + contentId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Save the given content for the given content id on the backend.
   * @param contentId content identifier
   * @param content serialized content to persist
   * @param successCallback called upon successful retrieval of the content
   * @param errorCallback called upon failed retrieval of the content
   */
  public saveContent(contentId: string,
                     content: SerializedCmsContent,
                     successCallback: (content: SerializedCmsContent) => void,
                     errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    ContentService.LOG.debug('Saving content with id ' + contentId + '...');
    this.http.put<SerializedCmsContent>(this.envService.endpoints.saveContent(contentId), content)
      .map(c => SerializedCmsContent.fromObject(c, this.envService))
      .subscribe((c: SerializedCmsContent) => {
        ContentService.LOG.debug('Saved content with id ' + contentId + ' successfully.');
        successCallback(c);
      }, (e: any) => {
        ContentService.LOG.error('Could not save content with id ' + contentId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Set the element map for this content service.
   * @param elementMap may not be null or undefined
   */
  public setElementMap(elementMap: CmsElementMap<CmsElement>): void {
    this.elementMap = elementMap;
  }

  /**
   * @param elementName cms element name (see #getName())
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
   * Signal that a new element has been added.
   */
  public elementAdd(element: CmsElement) {
    return this.elementAddSubject.next(element);
  }

  /**
   * Returns an observable that triggers when
   * elements are slotted into a layout.
   */
  public onElementAdd() {
    return this.elementAddSubject.asObservable();
  }

}
