
import {map, timeout} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {PhenologyDatasetFrontend} from '../../../entities/phenology-dataset-frontend.entity';
import {Image} from '../../../entities/image.entity';
import {AbstractService} from '../../../../shared/services/abstract.service';
import {EnvironmentService} from '../../../../shared/services/environment.service';
import {Log} from '../../../../shared/services/log.service';
import {PhenologyObservationTypeFrontend} from '../../../entities/phenology-observation-type-frontend.entity';
import {ActivatedRoute, Router} from '@angular/router';


import {PhenologyDataset} from '../../../entities/phenology-dataset.entity';
import {Observable, Subject} from 'rxjs';
import {ApiError} from '../../../../shared/entities/api-error.entity';
import {SubscriptionManagerService} from '../../subscription-manager.service';
import {TreeFrontend} from '../../../entities/tree-frontend.entity';
import {HttpClient, HttpErrorResponse, HttpEventType} from '@angular/common/http';
import {PhenologyDatasetWithTree} from '../../../entities/phenology-dataset-with-tree.entity';

@Injectable()
export class PhenologyObservationService extends AbstractService {

  private static LOG: Log = Log.newInstance(PhenologyObservationService);

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
   * If an obs spec is loaded, this contains that specs' species id.
   * Used to use previous obs spec if another tree with same species is selected.
   */
  private observationSpecSpeciesId: number;

  /**
   * The tree to observe.
   */
  public selectedTree: TreeFrontend;

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
  }

  /**
   * Load the last 10 phenology datasets for the given user.
   * @param {(types: Array<PhenologyObservationTypeFrontend>) => void} successCallback Called upon success
   * @param {(error: any) => void} errorCallback Called upon exception
   */
  public loadUserHistory(userId: number,
                         successCallback: (types: Array<PhenologyDatasetWithTree>) => void,
                         errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<PhenologyDataset>>(this.envService.endpoints.phenologyHistory(userId)).pipe(
      timeout(this.envService.defaultTimeout),
      map(value => value.map(element => PhenologyDatasetWithTree.fromObject(element))),)
      .subscribe((history: Array<PhenologyDatasetWithTree>) => {
        successCallback(history);
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Couldn\'t load phenology observation history for user id ' + userId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
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
    if (this.observationSpec && this.observationSpecSpeciesId && this.observationSpecSpeciesId === this.selectedTree.species.id) {
      successCallback(this.observationSpec);
      return;
    }

    let selectedSpeciesId = this.selectedTree.species.id;
    this.observationSpec = new Array<PhenologyObservationTypeFrontend>();
    this.observationSpecSpeciesId = selectedSpeciesId;

    this.http.get<Array<PhenologyObservationTypeFrontend>>(this.envService.endpoints.getPhenologySpec(selectedSpeciesId)).pipe(
      timeout(this.envService.defaultTimeout),
      map(value => value.map(element => PhenologyObservationTypeFrontend.fromObject(element))),)
      .subscribe((types: Array<PhenologyObservationTypeFrontend>) => {
        this.observationSpec = types;
        successCallback(types);
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Couldn\'t load observation spec for species id ' + selectedSpeciesId + ': ' + e.message, e);
        if (errorCallback) {
          errorCallback(e, this.safeApiError(e));
        }
      });

  }

  /**
   * Load all available observation types.
   * Currently not used in phenology observation, but in admin console.
   * @param successCallback executed upon success
   * @param errorCallback executed upon error
   */
  public loadAllPhenologyObservationTypes(successCallback: (types: Array<PhenologyObservationTypeFrontend>) => void,
                                          errorCallback?: (error: HttpErrorResponse, apiError?: ApiError) => void): void {

    this.http.get<Array<PhenologyObservationTypeFrontend>>(this.envService.endpoints.phenologyObservationTypes).pipe(
      timeout(this.envService.defaultTimeout),
      map(value => value && value.map(element => PhenologyObservationTypeFrontend.fromObject(element))),)
      .subscribe((types: Array<PhenologyObservationTypeFrontend>) => {
        successCallback(types);
      }, (e: any) => {
        PhenologyObservationService.LOG.error('Couldn\'t load observation types: ' + e.message, e);
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

    let selectedTreeSpeciesId = this.selectedTree.species.id;

    this.images[resultId] = new Image(0);
    let url = this.envService.endpoints.getPhenologyObservationResultImg(selectedTreeSpeciesId, resultId);
    this.http.get<Image>(url).pipe(
      timeout(this.envService.defaultTimeout),
      map(r => r && Image.fromObject(r)),)
      .subscribe((image: Image) => {
      image.encodedImage = 'data:image/jpeg;base64,' + image.encodedImage;
      this.images[resultId] = image;
      successCallback();
    }, (e: any) => {
      PhenologyObservationService.LOG.error('Could not load image for result id ' + resultId + ': ' + e.message, e);
      if (errorCallback) {
        errorCallback(e, this.safeApiError(e));
      }
      delete this.images[resultId];
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

    let path = this.envService.endpoints.getPhenologyDatasetSubmission(this.dataset.treeId);
    this.http.post(path, this.dataset.apply(this.envService.outputDateFormat)).pipe(
      timeout(this.envService.defaultTimeout),
      map(value => PhenologyDataset.fromObject(value)),)
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
   * Observation was in the past, so set max obs date & date to now.
   */
  public observationInPast(): void {
    this.dataset.uiObservationDate = new Date();
    this.dataset.uiMaxObservationDate = new Date();
  }

  /**
   * Reset observation data.
   */
  public reset(): void {

    this.dataset = new PhenologyDatasetFrontend();
    this.observationSpec = undefined;
    this.selectedTree = undefined;
    this.userImage = undefined;

  }

  /**
   * Select the tree to be loaded and reset the spec
   * so it will be reloaded.
   */
  public selectTree(tree: TreeFrontend): void {
    // force refresh of changed species spec
    if (this.selectedTree && tree.species.id !== this.selectedTree.species.id) {
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
