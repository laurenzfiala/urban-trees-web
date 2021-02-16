import { Component, OnInit } from '@angular/core';
import {Report} from '../../entities/report.entity';
import {MessagesService} from '../../services/messages.service';
import {AuthService} from '../../../shared/services/auth.service';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {ReportFrontend} from '../../entities/report-frontend.entity';
import {UserService} from '../../services/user.service';
import {EventSeverity} from '../../entities/event.entity';
import {EnvironmentService} from '../../../shared/services/environment.service';
import * as moment from 'moment';

@Component({
  selector: 'ut-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public availableReports: Array<ReportFrontend>;
  private editingReport: ReportFrontend;

  constructor(private messagesService: MessagesService,
              private userService: UserService,
              private authService: AuthService,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit() {
    if (this.authService.isAdmin()) {
      this.loadReports();
    }
  }

  /**
   * Load reports using MessagesService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadReports(successCallback?: () => void): void {

    this.setStatus(StatusKey.REPORTS, StatusValue.IN_PROGRESS);
    this.messagesService.loadReports((reports: Array<ReportFrontend>) => {
      this.availableReports = reports;
      this.userService.getUserData().newMessagesAmount = reports.length;
      this.setStatus(StatusKey.REPORTS, StatusValue.SUCCESSFUL);
      if (successCallback) {
        successCallback();
      }
    }, (error, apiError) => {
      this.setStatus(StatusKey.REPORTS, StatusValue.FAILED, apiError);
    });

  }

  private editRemark(report: ReportFrontend): void {
    this.editingReport = report;
  }

  private isEditingReport(report: Report): boolean {
    return report === this.editingReport;
  }

  private updateReportRemark(report: Report): void {

    this.messagesService.updateReportRemark(report, () => {

      this.editingReport = null;
    }, (error, apiError) => {

    });

  }

  private resolveReport(report: ReportFrontend): void {

    this.messagesService.resolveReport(report, () => {

      this.userService.getUserData().newMessagesAmount--;
      report.wasResolved = true;
      this.editingReport = null;
    }, (error, apiError) => {

    });

  }

  private unresolveReport(report: ReportFrontend): void {

    this.messagesService.unresolveReport(report, () => {

      this.userService.getUserData().newMessagesAmount++;
      report.wasResolved = false;
      this.editingReport = null;
    }, (error, apiError) => {

    });

  }

}

export enum StatusKey {

  REPORTS

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
