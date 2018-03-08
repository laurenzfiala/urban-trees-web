import {Injectable} from '@angular/core';
import {PhenologyDatasetFrontend} from '../../../entities/phenology-dataset-frontend.entity';
import {Image} from '../../../entities/image.entity';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {AbstractService} from '../../abstract.service';
import {EnvironmentService} from '../../environment.service';
import {Tree} from '../../../entities/tree.entity';
import {Log} from '../../log.service';
import {PhenologyObservationTypeFrontend} from '../../../entities/phenology-observation-type-frontend.entity';
import {ActivatedRoute, Router} from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import {PhenologyDataset} from '../../../entities/phenology-dataset.entity';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {ApiError} from '../../../entities/api-error.entity';
import {SubscriptionManagerService} from '../../subscription-manager.service';

@Injectable()
export class PhenologyObservationService extends AbstractService {

  private static LOG: Log = Log.newInstance(PhenologyObservationService);

  /**
   * Whether the observation data should be reset or not.
   * Called upon init of first observation stap.
   */
  private markedForReset: boolean = false;

  /**
   * Index of the current step displayed.
   */
  public currentStepIndex: number = 0;

  /**
   * Step thats currently finished. Used to determine which steps
   * and navigation buttons to display.
   */
  public finishedStepIndex: number = -1;

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
   * Image from the user to be uploaded.
   */
  public userImage: File;

  /**
   * Observable to push to the component on upload progress.
   */
  public uploadUserImageSubject: Subject<number>;

  /**
   * Map of images to show for different result ids.
   */
  public images: Map<number, Image> = new Map<number, Image>();

  constructor(private http: HttpClient,
              private router: Router,
              private route: ActivatedRoute,
              private sub: SubscriptionManagerService,
              private envService: EnvironmentService) {
    super();
    this.initDataset();
  }

  /**
   * Load all available trees.
   * @param {(trees: Array<Tree>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadTrees(successCallback: (trees: Array<Tree>) => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void) {

    let headers = this.getAuthHeaders();

    this.http.get<Array<Tree>>(this.envService.endpoints.allTrees, {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .subscribe((results: Array<Tree>) => {
        successCallback(results);
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Could not load trees: ' + e.message, e);
        errorCallback(e, this.safeApiError(e));
      });

  }

  /**
   * Load the observation specification for the currently selected tree.
   * @param {(types: Array<PhenologyObservationTypeFrontend>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadObservationSpec(successCallback: (types: Array<PhenologyObservationTypeFrontend>) => void,
                             errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

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
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Couldn\'t load observation spec for tree id ' + selectedTreeId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
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
  public loadResultImg(resultId: number, successCallback: () => void,
                       errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

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
        errorCallback(e, this.safeApiError(e));
      }
    });

  }

  /**
   * Prepare submission by populating the dataset with the frontend values
   * and then send it.
   * @param {() => void} successCallback when the submission was successful
   * @param {(error: any) => void} errorCallback if it failed
   */
  public submit(successCallback: (phenologyId: number) => void,
                errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.dataset.treeId = this.selectedTree.id;

    let headers = this.getAuthHeaders();

    let path = this.envService.endpoints.getPhenologyDatasetSubmission(this.dataset.treeId);
    this.http.post(path, this.dataset.apply(), {headers: headers})
      .timeout(this.envService.defaultTimeout)
      .map(value => PhenologyDataset.fromObject(value))
      .subscribe((result: PhenologyDataset) => {
      PhenologyObservationService.LOG.info('Successfully submitted phenology observation dataset.');
      successCallback(result.id);
    }, (e: any) => {
      PhenologyObservationService.LOG.error('Could not save observation: ' + e.error.message, e);
      if (errorCallback) {
        errorCallback(e, this.safeApiError(e));
      }
    });

  }

  /**
   * Submit the optional phenology observation image to the backend.
   * @param {number} phenologyId Id of the previously submitted phenology observation data.
   * @param {() => void} successCallback when the upload was successful.
   * @param {(error: HttpErrorResponse, apiError?: ApiError) => void} errorCallback if it failed
   * @returns {Observable<number>} called upon status info of the upload.
   */
  public submitImg(phenologyId: number,
                   successCallback: () => void,
                   errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): Observable<number> {

    if (!this.userImage) {
      return;
    }

    let formdata: FormData = new FormData();
    formdata.append('file', this.userImage);

    let uploadProgress = 0;

    this.http.post(this.envService.endpoints.getPhenologyDatasetImageSubmission(phenologyId), formdata, {
      headers: this.getAuthHeaders(),
      reportProgress: true,
      responseType: 'text'
    }).subscribe((event: any) => {
      if (event.type === HttpEventType.UploadProgress) {
        uploadProgress = Math.round(100 * event.loaded / event.total);
        PhenologyObservationService.LOG.info('Uploading image: ' + uploadProgress + ' %');
        this.uploadUserImageSubject.next(uploadProgress);
      } else {
        PhenologyObservationService.LOG.info('Successfully uploaded image.');
        successCallback();
      }
    }, (e: any) => {
      PhenologyObservationService.LOG.error('Could not upload observation image: ' + e.error.message, e);
      if (errorCallback) {
        errorCallback(e, this.safeApiError(e));
      }
    });

    this.uploadUserImageSubject = new Subject<number>();

    return this.uploadUserImageSubject.asObservable();

  }

  /**
   * Initialize observation data for use.
   */
  public initDataset(): void {
    this.dataset.uiObservationDate = new Date();
    this.dataset.uiMaxObservationDate = new Date();
  }

  public markToBeReset() {
    this.markedForReset = true;
  }

  /**
   * Reset observation data.
   */
  public resetIfMarked(): void {
    if (!this.markedForReset) {
      return;
    }
    this.markedForReset = false;
    this.dataset = new PhenologyDatasetFrontend();
    this.observationSpec = undefined;
    this.selectedTree = undefined;
    this.initDataset();
  }

  /**
   * Select the tree to be loaded and reset the spec
   * so it will be reloaded.
   */
  public selectTree(tree: Tree): void {
    // force refresh of changed species spec
    if (this.selectedTree && tree.speciesId !== this.selectedTree.speciesId) {
      this.observationSpec = null;
    }
    this.selectedTree = tree;
  }

  /**
   * Set whether the given step index is done or not.
   * @param {number} stepIndex index of the step which is finished or not
   * @param {boolean} isDone whether the given step is done or not
   */
  public setDone(stepIndex: number, isDone: boolean, force?: boolean): void {
    if (!force && isDone && stepIndex <= this.finishedStepIndex) {
      return;
    }
    if (isDone) {
      this.finishedStepIndex = stepIndex;
    } else {
      this.finishedStepIndex = stepIndex - 1;
    }
  }

}
