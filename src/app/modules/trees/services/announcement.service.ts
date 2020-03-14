import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AbstractService} from '../../shared/services/abstract.service';
import {EnvironmentService} from '../../shared/services/environment.service';
import {Announcement} from '../entities/announcement.entity';
import {Log} from '../../shared/services/log.service';
import 'rxjs/add/operator/map';
import {ApiError} from '../../shared/entities/api-error.entity';

/**
 * Service used to hold data about announcements shown on top of the page.
 *
 * @author Laurenz Fiala
 * @since 2018/02/22
 */
@Injectable()
export class AnnouncementService extends AbstractService {

  private static LOG: Log = Log.newInstance(AnnouncementService);

  private static announcements: Array<Announcement>;

  constructor(private http: HttpClient,
              private envService: EnvironmentService) {
    super();
  }

  /**
   * Load all current announcements from the backend.
   */
  public load(): void {

    if (AnnouncementService.announcements) {
      return;
    }

    this.http.get<Array<Announcement>>(this.envService.endpoints.announcements)
      .map(list => list && list.map(a => Announcement.fromObject(a)))
      .subscribe((announcements: Array<Announcement>) => {
      AnnouncementService.LOG.trace('Successfully loaded announcements.');
      AnnouncementService.announcements = announcements;
    }, (e: any) => {
        AnnouncementService.LOG.warn('Could not load announcements: ' + e.message, e);
    });

  }

  public getAnnouncements(): Array<Announcement> {
    return AnnouncementService.announcements;
  }

  /**
   * Load all announcements from the backend.
   */
  public loadAllAnnouncements(successCallback: (announcements: Array<Announcement>) => void,
                              errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<Announcement>>(this.envService.endpoints.allAnnouncements)
      .map(list => list && list.map(a => Announcement.fromObject(a)))
      .subscribe((announcements: Array<Announcement>) => {
        AnnouncementService.LOG.trace('Successfully loaded all announcements.');
        successCallback(announcements);
      }, (e: any) => {
        AnnouncementService.LOG.error('Could not load all announcements: ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

}

