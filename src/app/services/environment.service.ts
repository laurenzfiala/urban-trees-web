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

  get allTrees() {
    return this.prependCommonPath(this.context.allTrees);
  }

  public getPhenologySpec(treeId: number) {

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

  public getPhenologyObservationResultImg(treeSpeciesId: number, resultId: number) {

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

  public getPhenologyObservationSubmission(treeId: number) {

    let replacements: any[] = [
      { placeholder: 'treeId', replacement: treeId }
    ];

    return this.prependCommonPath(
      this.replaceParams(
        this.context.phenologyObservationSubmission,
        replacements
      )
    );

  }

  get announcements() {
    return this.prependCommonPath(this.context.announcements);
  }

}
