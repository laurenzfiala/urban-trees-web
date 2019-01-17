import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

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
  public security: SecurityEndpoints = new SecurityEndpoints();

  get defaultTimeout() {
    return this.context.defaultTimeout;
  }

  get imageUploadTimeout() {
    return this.context.imageUploadTimeout;
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

  get userAchievements() {
    return this.prependCommonPath(this.context.userAchievements);
  }

  get announcements() {
    return this.prependCommonPath(this.context.announcements);
  }

  get cities() {
    return this.prependCommonPath(this.context.cities);
  }

  get species() {
    return this.prependCommonPath(this.context.species);
  }

  get statistics() {
    return this.prependCommonPath(this.context.statistics);
  }

  get login() {
    return this.prependCommonPath(this.context.login);
  }

  get changePassword() {
    return this.prependCommonPath(this.context.changePassword);
  }

  get addCity() {
    return this.prependCommonPath(this.context.addCity);
  }

  get addTree() {
    return this.prependCommonPath(this.context.addTree);
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

  get addBeacon() {
    return this.prependCommonPath(this.context.addBeacon);
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

class SecurityEndpoints {

  private context = environment.security;

  get rolesUser() {
    return this.context.roles.user;
  }

  get rolesPhenObs() {
    return this.context.roles.phenObs;
  }

  get rolesAdmin() {
    return this.context.roles.admin;
  }

}
