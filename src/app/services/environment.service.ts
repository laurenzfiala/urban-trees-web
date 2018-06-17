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

  get announcements() {
    return this.prependCommonPath(this.context.announcements);
  }

  get cities() {
    return this.prependCommonPath(this.context.cities);
  }

  get statistics() {
    return this.prependCommonPath(this.context.statistics);
  }

  get login() {
    return this.prependCommonPath(this.context.login);
  }

  public beaconData(beaconId: number): string {

    let replacements: any[] = [
      { placeholder: 'beaconId', replacement: beaconId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.beaconData,
        replacements
      )
    );

  }

}
