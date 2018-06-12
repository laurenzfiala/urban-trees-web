import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from './abstract.service';
import {EnvironmentService} from './environment.service';
import {Announcement} from '../entities/announcement.entity';
import {Log} from './log.service';
import 'rxjs/add/operator/map';

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

}
