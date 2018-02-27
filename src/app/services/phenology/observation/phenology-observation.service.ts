import {Injectable} from '@angular/core';
import {PhenologyDatasetFrontend} from '../../../entities/phenology-dataset-frontend.entity';
import {Image} from '../../../entities/image.entity';
import {HttpClient} from '@angular/common/http';
import {AbstractService} from '../../abstract.service';
import {EnvironmentService} from '../../environment.service';
import {MenuItem} from 'primeng/api';
import {Tree} from '../../../entities/tree.entity';
import {Log} from '../../log.service';
import {PhenologyObservationTypeFrontend} from '../../../entities/phenology-observation-type-frontend.entity';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class PhenologyObservationService extends AbstractService {

  private static LOG: Log = Log.newInstance(PhenologyObservationService);

  /**
   * This array contains all available steps for phenology observation
   * with their corresponding path and title.
   */
  public static steps: any[] = [
    {
      path: '1',
      title: 'Tree',
      continue: false
    },
    {
      path: '2',
      title: 'Observation',
      continue: false
    },
    {
      path: '3',
      title: 'Documentation',
      continue: false
    },
    {
      path: '4',
      title: 'Review',
      continue: false
    }
  ];

  /**
   * Index of the current step displayed.
   */
  public currentStepIndex: number = 0;

  /**
   * List of observation types possible for the currently selected tree.
   */
  public observationSpec: Array<PhenologyObservationTypeFrontend>;

  /**
   * The tree to observe.
   */
  public selectedTree: Tree;

  /**
   * New observation data populated by the user.
   */
  public dataset: PhenologyDatasetFrontend = new PhenologyDatasetFrontend();

  /**
   * Map of images to show for different result ids.
   */
  public images: Map<number, Image> = new Map<number, Image>();

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private envService: EnvironmentService,
              private translateService: TranslateService) {
    super();
    this.initDataset();
  }

  /**
   * Load all available trees.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadTrees(successCallback: (trees: Array<Tree>) => void, errorCallback?: (error: any) => void) {

    let headers = this.getAuthHeaders();

    this.http.get<Array<Tree>>(this.envService.endpoints.allTrees, {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<Tree>) => {
        successCallback(results);
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Could not load trees: ' + e.message, e);
        errorCallback(e);
      });

  }

  /**
   * Load the observation specification for the currently selected tree.
   * @param {(types: Array<PhenologyObservationTypeFrontend>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadObservationSpec(successCallback: (types: Array<PhenologyObservationTypeFrontend>) => void, errorCallback?: (error: any) => void): void {

    // return cached spec
    if (this.observationSpec) {
      successCallback(this.observationSpec);
      return;
    }

    let selectedTreeId = this.selectedTree.speciesId;
    this.observationSpec = new Array<PhenologyObservationTypeFrontend>();

    let headers = this.getAuthHeaders();

    this.http.get<Array<PhenologyObservationTypeFrontend>>(this.envService.endpoints.getPhenologySpec(selectedTreeId), {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .map(value => value.map(element => PhenologyObservationTypeFrontend.fromObject(element)))
      .subscribe((types: Array<PhenologyObservationTypeFrontend>) => {
        this.observationSpec = types;
        successCallback(types);
      }, (e) => {
        PhenologyObservationService.LOG.error('Couldn\'t load observation spec for tree id ' + selectedTreeId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e);
        }
      });

  }

  /**
   * Load the result image for the given resultId using the set
   * #selectedTree#speciesId.
   * @param {number} resultId id of the result image to get
   * @param {() => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadResultImg(resultId: number, successCallback: () => void, errorCallback?: (error: any) => void): void {

    let selectedTreeSpeciesId = this.selectedTree.speciesId;

    let headers = this.getAuthHeaders();

    let t = this.envService.endpoints.getPhenologyObservationResultImg(selectedTreeSpeciesId, resultId);
    this.http.get<Image>(t, {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .subscribe((image: Image) => {
      image.encodedImage = 'data:image/jpeg;base64,' + image.encodedImage;
      this.images[resultId] = image;
      successCallback();
    }, (e: any) => {
      PhenologyObservationService.LOG.error('Could not load image for result id ' + resultId + ': ' + e.message, e);
      if (errorCallback) {
        errorCallback(e);
      }
    });

  }

  /**
   * Prepare submission by populating the dataset with the frontend values
   * and then send it.
   * @param {() => void} successCallback when the submission was successful
   * @param {(error: any) => void} errorCallback if it failed
   */
  public submit(successCallback: () => void, errorCallback?: (error: any) => void): void {

    this.dataset.treeId = this.selectedTree.id;

    let headers = this.getAuthHeaders();

    let path = this.envService.endpoints.getPhenologyObservationSubmission(this.dataset.treeId);
    this.http.post(path, this.dataset.apply(), {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .subscribe((result: any) => {
      PhenologyObservationService.LOG.info('Successfully submitted phenology observation dataset.');
      successCallback();
    }, (e: any) => {
      PhenologyObservationService.LOG.error('Could not save observation: ' + e.message, e);
      if (errorCallback) {
        errorCallback(e);
      }
    });

  }

  /**
   * Initializ observation data for use.
   */
  public initDataset() {
    this.dataset.uiObservationDate = new Date();
    this.dataset.uiMaxObservationDate = new Date();
  }

  /**
   * Create menu items for the steps component.
   */
  public getMenuItems(): MenuItem[] {

    let items = new Array<MenuItem>();
    for (let i of PhenologyObservationService.steps) {
      this.translateService.get('phenology.observation.navigation.step' + i.path).subscribe((translated: string) => {
        items.push({'label': translated});
      });
    }
    return items;

  }

  /**
   * If previous steps are not finished, return false.
   */
  public checkStepPreconditions(): boolean {

    for (let i = 0; i < this.currentStepIndex; i++) {
      if (!PhenologyObservationService.steps[i].continue) {
        return false;
      }
    }
    return true;

  }

  /**
   * Select the tree to be loaded and reset the spec
   * so it will be reloaded.
   */
  public selectTree(tree: Tree): void {
    this.selectedTree = tree;
    this.observationSpec = null;
  }

  get currentStep() {
    return PhenologyObservationService.steps[this.currentStepIndex];
  }

  public setContinue(value: boolean) {
    this.currentStep.continue = value;
  }

  get nextStep() {
    let nextStepIndex = this.currentStepIndex + 1;
    if (nextStepIndex >= PhenologyObservationService.steps.length) {
      return null;
    }
    return PhenologyObservationService.steps[nextStepIndex];
  }

  get previousStep() {
    let previousStepIndex = this.currentStepIndex - 1;
    if (previousStepIndex < 0) {
      return null;
    }
    return PhenologyObservationService.steps[previousStepIndex];
  }

}
