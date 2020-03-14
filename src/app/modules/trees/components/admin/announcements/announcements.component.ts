import {Component, OnInit, TemplateRef} from '@angular/core';
import {AnnouncementService} from '../../../services/announcement.service';
import {Announcement} from '../../../entities/announcement.entity';
import {AbstractComponent} from '../../abstract.component';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {BsModalService} from 'ngx-bootstrap/modal';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiError} from '../../../../shared/entities/api-error.entity';
import {AdminService} from '../../../services/admin/admin.service';
import * as moment from 'moment';

@Component({
  selector: 'ut-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.less']
})
export class AnnouncementsComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public announcements: Array<Announcement>;

  private newAnnouncementModalRef: BsModalRef;
  public newAnnouncement: Announcement;
  public newAnnouncementDisplayDateRange: Date[];
  public newAnnouncementDateRangeCheckExpression: () => boolean = () => {return this.newAnnouncementDisplayDateRange !== undefined};

  constructor(private announcementService: AnnouncementService,
              private adminService: AdminService,
              private modalService: BsModalService) {
    super();
  }

  public ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {

    this.setStatus(StatusKey.ANNOUNCEMENTS, StatusValue.IN_PROGRESS);
    this.announcementService.loadAllAnnouncements((announcements: Array<Announcement>) => {
      this.announcements = announcements;
      this.setStatus(StatusKey.ANNOUNCEMENTS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.ANNOUNCEMENTS, StatusValue.FAILED);
    });

  }

  public isDisplayNow(a: Announcement): boolean {
    let now = new Date().getTime();
    return a.displayFromDate.getTime() <= now && a.displayToDate.getTime() >= now;
  }

  public showNewAnnouncementModal(modalTemplateRef: TemplateRef<any>): void {
    this.newAnnouncement = new Announcement();
    this.newAnnouncementModalRef = this.modalService.show(modalTemplateRef);
  }

  public hideNewAnnouncementModal(): void {
    this.newAnnouncementModalRef.hide();
  }

  public addAnnouncement(): void {

    this.newAnnouncement.displayFromDate = moment(this.newAnnouncementDisplayDateRange[0]).startOf('day').toDate();
    this.newAnnouncement.displayToDate = moment(this.newAnnouncementDisplayDateRange[1]).endOf('day').toDate();

    this.setStatus(StatusKey.NEW_ANNOUNCEMENT, StatusValue.IN_PROGRESS);
    this.adminService.addAnnouncement(this.newAnnouncement, () => {
      this.setStatus(StatusKey.NEW_ANNOUNCEMENT, StatusValue.SUCCESSFUL);
      this.loadAnnouncements();
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      this.setStatus(StatusKey.NEW_ANNOUNCEMENT, StatusValue.FAILED);
    });

  }

  public deleteAnnouncement(a: Announcement): void {

    a.deleteStatus = StatusValue.IN_PROGRESS;
    this.adminService.deleteAnnouncement(a.id, () => {
      a.deleteStatus = StatusValue.SUCCESSFUL;
    }, (error: HttpErrorResponse, apiError: ApiError) => {
      a.deleteStatus = StatusValue.FAILED;
    });

  }

}

export enum StatusKey {

  ANNOUNCEMENTS,
  NEW_ANNOUNCEMENT

}

export enum StatusValue {

  IN_PROGRESS,
  SUCCESSFUL,
  FAILED

}
