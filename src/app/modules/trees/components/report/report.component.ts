import {Component, OnInit} from '@angular/core';
import {Report} from '../../entities/report.entity';
import {AbstractComponent} from '../../../shared/components/abstract.component';
import {BeaconFrontend} from '../../entities/beacon-frontend.entity';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'ut-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.less']
})
export class ReportComponent extends AbstractComponent implements OnInit {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public showReportForm: boolean = false;

  public reportText: string;

  public reports: Array<Report>;

  constructor(private userService: UserService) {
    super();
  }

  public ngOnInit(): void {
    this.loadReports();
  }

  public loadReports(): void {

    this.setStatus(StatusKey.LOAD_REPORTS, StatusValue.IN_PROGRESS);
    this.userService.loadReports((reports: Array<Report>) => {
      this.reports = reports;
      this.setStatus(StatusKey.LOAD_REPORTS, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.LOAD_REPORTS, StatusValue.FAILED);
    });

  }

  public discardReport(): void {
    this.reportText = undefined;
    this.deleteStatus(StatusKey.SEND_REPORT);
  }

  public sendReport(): void {

    let newReport = new Report();
    newReport.message = this.reportText;
    this.setStatus(StatusKey.SEND_REPORT, StatusValue.IN_PROGRESS);
    this.userService.sendReport(newReport, () => {
      this.setStatus(StatusKey.SEND_REPORT, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.SEND_REPORT, StatusValue.FAILED);
    });

  }

}

export enum StatusKey {

  LOAD_REPORTS,
  SEND_REPORT

}

export enum StatusValue {

  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}
