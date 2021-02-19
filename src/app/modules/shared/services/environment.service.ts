import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {BeaconLogSeverity} from '../../trees/entities/BeaconLogSeverity';

/**
 * This service should be used to access all environment configurations, since
 * it makes the code way less brittle.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
@Injectable()
export class EnvironmentService {

  private context = environment;

  public endpoints: EnvironmentEndpoints = new EnvironmentEndpoints();
  public security: Security = new Security();

  get searchDebounceMs() {
    return this.context.searchDebounceMs;
  }

  get searchDebounceApiMs() {
    return this.context.searchDebounceApiMs;
  }

  get defaultTimeout() {
    return this.context.defaultTimeout;
  }

  get imageUploadTimeout() {
    return this.context.imageUploadTimeout;
  }

  get userDataRefreshIntervalMs() {
    return this.context.userDataRefreshIntervalMs;
  }

  get outputDateFormat() {
    return this.context.outputDateFormat;
  }

}

class EnvironmentEndpoints {

  private context = environment.endpoints;

  private prependCommonPath(path: string) {
    return this.host + path;
  }

  private replaceParams(path: string, replacements: any[]) {

    for (let r of replacements) {
      path = path.replace('{' + r.placeholder + '}', r.replacement);
    }
    return path;

  }

  get host() {
    return environment.host;
  }

  get mapHost() {
    return environment.mapHost;
  }

  public tree(treeId: number): string {

    let replacements: any[] = [
      { placeholder: 'treeId', replacement: treeId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.tree,
        replacements
      )
    );

  }

  get allTrees() {
    return this.prependCommonPath(this.context.allTrees);
  }

  public getPhenologySpec(treeId: number): string {

    let replacements: any[] = [
      { placeholder: 'treeId', replacement: treeId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologySpec,
        replacements
      )
    );

  }

  public getPhenologyObservationResultImg(treeSpeciesId: number, resultId: number): string {

    let replacements: any[] = [
      { placeholder: 'treeSpeciesId', replacement: treeSpeciesId },
      { placeholder: 'resultId',      replacement: resultId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologyObservationResultImg,
        replacements
      )
    );

  }

  public getPhenologyDatasetSubmission(treeId: number): string {

    let replacements: any[] = [
      { placeholder: 'treeId', replacement: treeId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologyDatasetSubmission,
        replacements
      )
    );

  }

  public getPhenologyDatasetImageSubmission(phenologyId: number): string {

    let replacements: any[] = [
      { placeholder: 'phenologyId', replacement: phenologyId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologyDatasetImageSubmission,
        replacements
      )
    );

  }

  public phenologyHistory(userId: number): string {

    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologyHistory,
        replacements
      )
    );

  }

  get userAchievements() {
    return this.prependCommonPath(this.context.userAchievements);
  }

  get userData() {
    return this.prependCommonPath(this.context.userData);
  }

  get userDeleteAccount() {
    return this.prependCommonPath(this.context.userDelete);
  }

  get announcements() {
    return this.prependCommonPath(this.context.announcements);
  }

  get allAnnouncements() {
    return this.prependCommonPath(this.context.allAnnouncements);
  }

  get addAnnouncement() {
    return this.prependCommonPath(this.context.addAnnouncement);
  }

  public deleteAnnouncement(announcementId: number): string {

    let replacements: any[] = [
      { placeholder: 'announcementId', replacement: announcementId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.deleteAnnouncement,
        replacements
      )
    );

  }

  get allReports() {
    return this.prependCommonPath(this.context.allReports);
  }

  public updateReportRemark(reportId: number): string {

    let replacements: any[] = [
      { placeholder: 'reportId', replacement: reportId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.updateReportRemark,
        replacements
      )
    );

  }

  public unresolveReport(reportId: number): string {

    let replacements: any[] = [
      { placeholder: 'reportId', replacement: reportId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.unresolveReport,
        replacements
      )
    );

  }

  public resolveReport(reportId: number): string {

    let replacements: any[] = [
      { placeholder: 'reportId', replacement: reportId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.resolveReport,
        replacements
      )
    );

  }

  get cities() {
    return this.prependCommonPath(this.context.cities);
  }

  get species() {
    return this.prependCommonPath(this.context.species);
  }

  get measurementsStatistics() {
    return this.prependCommonPath(this.context.measurementsStatistics);
  }

  get systemStatistics() {
    return this.prependCommonPath(this.context.systemStatistics);
  }

  get login() {
    return this.prependCommonPath(this.context.login);
  }

  get changePassword() {
    return this.prependCommonPath(this.context.changePassword);
  }

  get changeUsername() {
    return this.prependCommonPath(this.context.changeUsername);
  }

  get usingOtp() {
    return this.prependCommonPath(this.context.usingOtp);
  }

  get activateOtp() {
    return this.prependCommonPath(this.context.activateOtp);
  }

  get deactivateOtp() {
    return this.prependCommonPath(this.context.deactivateOtp);
  }

  get addUserPermission() {
    return this.prependCommonPath(this.context.addUserPermission);
  }

  public usersGrantingPermission(permission: string): string {

    let replacements: any[] = [
      { placeholder: 'permission', replacement: permission }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.usersGrantingPermission,
        replacements
      )
    );

  }

  get loadPPIN() {
    return this.prependCommonPath(this.context.loadPPIN);
  }

  get addCity() {
    return this.prependCommonPath(this.context.addCity);
  }

  get addTree() {
    return this.prependCommonPath(this.context.addTree);
  }

  get addUsers() {
    return this.prependCommonPath(this.context.addUsers);
  }

  public modifyTree(treeId: number): string {

    let replacements: any[] = [
      { placeholder: 'treeId', replacement: treeId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.modifyTree,
        replacements
      )
    );

  }

  get phenologyObservationTypes() {
    return this.prependCommonPath(this.context.phenologyObservationTypes);
  }

  get addBeacon() {
    return this.prependCommonPath(this.context.addBeacon);
  }

  public modifyBeacon(beaconId: number): string {

    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.modifyBeacon,
        replacements
      )
    );

  }

  public deleteBeacon(beaconId: number): string {

    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.deleteBeacon,
        replacements
      )
    );

  }

  get loadBeacons() {
    return this.prependCommonPath(this.context.loadBeacons);
  }

  public loadBeacon(beaconId: number) {
    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.loadBeacon,
        replacements
      )
    );
  }

  public loadBeaconLogs(beaconId: number, minSeverity: BeaconLogSeverity, offset: number, maxLogs: number): string {

    let url = this.context.loadBeaconLogs;
    let params = [];

    if (beaconId) {
      params.push('beaconId=' + beaconId);
    }
    if (minSeverity) {
      params.push('minSeverity=' + minSeverity);
    }
    if (offset) {
      params.push('offset=' + offset);
    }
    if (maxLogs) {
      params.push('maxLogs=' + maxLogs);
    }

    let first = true;
    for (let param of params) {
      if (first) {
        first = false;
        url = url + '?';
      } else {
        url = url + '&';
      }
      url = url + param;
    }

    return this.prependCommonPath(url);

  }

  public loadUsers(limit: number, offset: number) {
    let replacements: any[] = [
      { placeholder: 'offset', replacement: offset ? offset : 0 },
      { placeholder: 'limit', replacement: limit ? '&limit=' + limit : '' }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.loadUsers,
        replacements
      )
    );
  }

  public usersBulkAction(action: string) {
    let replacements: any[] = [
      { placeholder: 'action', replacement: action }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.usersBulkAction,
        replacements
      )
    );
  }

  get loadRole() {
    return this.prependCommonPath(this.context.loadRole);
  }

  public deleteUser(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.deleteUser,
        replacements
      )
    );
  }

  get userReport() {
    return this.prependCommonPath(this.context.userReport);
  }

  public expireCredentials(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.expireCredentials,
        replacements
      )
    );
  }

  public activate(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.activate,
        replacements
      )
    );
  }

  public inactivate(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.inactivate,
        replacements
      )
    );
  }

  public addRoles(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.addRoles,
        replacements
      )
    );
  }

  public removeRoles(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.removeRoles,
        replacements
      )
    );
  }

  public loginKey(userId: number): string {
    let replacements: any[] = [
      { placeholder: 'userId', replacement: userId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.loginKey,
        replacements
      )
    );
  }

  public loginKeyUrl(token: string): string {
    let replacements: any[] = [
      { placeholder: 'token', replacement: token }
    ];

    return environment.webHost +
      this.replaceParams(
        this.context.loginKeyUrl,
        replacements
      );
  }

  public beaconData(beaconId: number, maxDatapoints?: number, timespanMin?: string, timespanMax?: string): string {

    let url = this.context.beaconData;
    if (timespanMin && timespanMax) {
      url = this.context.beaconDataTimespan;
    } else if (timespanMin) {
      url = this.context.beaconDataTimespanMin;
    } else if (timespanMax) {
      url = this.context.beaconDataTimespanMax;
    }

    if (maxDatapoints !== undefined) {
      if (url === this.context.beaconData) {
        url += '?maxDatapoints=' + maxDatapoints;
      } else {
        url += '&maxDatapoints=' + maxDatapoints;
      }
    }

    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId },
      { placeholder: 'timespanMin', replacement: timespanMin },
      { placeholder: 'timespanMax', replacement: timespanMax }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        url,
        replacements
      )
    );

  }

  public beaconSettings(beaconId: number): string {

    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.beaconSettings,
        replacements
      )
    );

  }

}

class Security {

  private context = environment.security;

  get minUsernameLength() {
    return this.context.minUsernameLength;
  }

  get minPasswordLength() {
    return this.context.minPasswordLength;
  }

  get interceptorRedirectExclusions() {
    return this.context.interceptorRedirectExclusions;
  }

  get jwtTokenExpireMs() {
    return this.context.jwtTokenExpireMs;
  }

  get adminTimeoutMs() {
    return this.context.adminTimeoutMs;
  }

  get rolesUser() {
    return this.context.roles.user;
  }

  get rolesTreeEditor() {
    return this.context.roles.treeEditor;
  }

  get rolesJournal() {
    return this.context.roles.journal;
  }

  get rolesPhenObs() {
    return this.context.roles.phenObs;
  }

  get rolesAdmin() {
    return this.context.roles.admin;
  }

  get roleTempChangePassword() {
    return this.context.roles.tempChangePassword;
  }

  get roleTempActivateOTP() {
    return this.context.roles.tempActivateOTP;
  }

}
