import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../shared/entities/api-error.entity';
import {AbstractService} from '../../shared/services/abstract.service';
import {Log} from '../../shared/services/log.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {SerializedCmsContent} from '../entities/serialized-cms-content.entity';

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
      .map(c => SerializedCmsContent.fromObject(c))
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

}
