import {Component, OnDestroy, OnInit} from '@angular/core';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';
import {SubscriptionManagerService} from '../../../services/subscription-manager.service';
import {Log} from '../../../../shared/services/log.service';
import {AbstractComponent} from '../../abstract.component';
import {TreeFrontend} from '../../../entities/tree-frontend.entity';
import {TreeService} from '../../../services/tree.service';
import {Tree} from '../../../entities/tree.entity';
import {MapMarker} from '../../../interfaces/map-marker.interface';
import {PhenologyDatasetFrontend} from '../../../entities/phenology-dataset-frontend.entity';
import {PhenologyObservationTypeFrontend} from '../../../entities/phenology-observation-type-frontend.entity';
import {PhenologyObservationResult} from '../../../entities/phenology-observation-result.entity';
import {PhenologyObservation} from '../../../entities/phenology-observation.entity';
import {EnvironmentService} from '../../../../shared/services/environment.service';
import {AuthService} from '../../../../shared/services/auth.service';
import {PhenologyObservationObject} from '../../../entities/phenology-observation-object.entity';
import {UserIdentity} from '../../../entities/user-identity.entity';
import {UserRewardService} from '../../../services/user-reward.service';
import {ActivatedRoute, Router, RouterStateSnapshot} from '@angular/router';

@Component({
  selector: 'ut-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.less']
})
export class ObservationComponent extends AbstractComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(ObservationComponent);
  private static SUBSCRIPTION_TAG: string = 'observation-cmp';
  private static PHENOBS_XP: number = 200;
  private static PHENOBS_IMG_XP: number = 150;

  /**
   * Query param to preselect a tree.
   */
  private static QUERY_PARAMS_SELECTED_TREE = 'tree';

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;
  public UserImageError = UserImageError;

  /**
   * Whether the observation may be sent off.
   * @see #checkProgress
   */
  public canSend: boolean = false;

  /**
   * Once loaded, contains all trees available for observation.
   */
  public availableTrees: Array<TreeFrontend>;

  /**
   * Whether the observation is now (true) or was in the past (false).
   */
  public isObserveNow: boolean = true;

  /**
   * True, if user wants to add more observers (= user id select shown)
   * False by default
   */
  public addMoreObservers: boolean = false;

  private nextObservationObjectIndex: number = 0;

  /**
   * Last successfully sent phen obs data id.
   */
  private lastPhenologyId: number;

  /**
   * Tree currently selected.
   */
  get selectedTree(): TreeFrontend {
    return this.observationService.selectedTree;
  }

  set selectedTree(value: TreeFrontend) {
    this.observationService.selectedTree = value;
  }

  get dataset(): PhenologyDatasetFrontend {
    return this.observationService.dataset;
  }

  constructor(private observationService: PhenologyObservationService,
              private subs: SubscriptionManagerService,
              private treeService: TreeService,
              public rewardService: UserRewardService,
              public authService: AuthService,
              private route: ActivatedRoute,
              public envService: EnvironmentService) {
    super();
  }

  public ngOnInit() {

    this.subs.register(this.route.queryParams.subscribe((params: any) => {

      const selectTreeIdVal = Number(params[ObservationComponent.QUERY_PARAMS_SELECTED_TREE]);
      this.load(selectTreeIdVal);

    }), ObservationComponent.SUBSCRIPTION_TAG);

    this.subs.register(this.authService.onStateChanged().subscribe(value => {
      this.onDiscard();
    }), ObservationComponent.SUBSCRIPTION_TAG);

    this.checkProgress();

  }

  public ngOnDestroy() {
    ObservationComponent.LOG.trace('Destroying phenology observation...');
    this.subs.unsubscribe(ObservationComponent.SUBSCRIPTION_TAG);
    this.onDiscard();
  }

  /**
   * Load available trees and initialize the map.
   */
  private load(selectTree?: number) {

    this.loadTrees(() => {

      if (selectTree) {
        this.selectTree(this.availableTrees.find((t: TreeFrontend) => t.id === selectTree));
      } else {
        let alreadySelected = this.observationService.selectedTree;
        if (alreadySelected) {
          this.selectTree(TreeFrontend.fromTree(alreadySelected));
        }
      }


    });

  }

  /**
   * Load all trees using PhenologyObservationService.
   * @param {() => void} successCallback when loading was successful.
   */
  private loadTrees(successCallback: () => void) {

    if (this.availableTrees) {
      successCallback();
      return;
    }

    this.setStatus(StatusKey.TREES, StatusValue.IN_PROGRESS);
    this.treeService.loadTrees((trees: Array<Tree>) => {
      this.availableTrees = trees.map(t => TreeFrontend.fromTree(t));
      this.setStatus(StatusKey.TREES, StatusValue.SUCCESSFUL);
      this.checkProgress();
      successCallback();
    }, () => {
      this.setStatus(StatusKey.TREES, StatusValue.FAILED);
      this.checkProgress();
    });

  }

  /**
   * Select a single tree to continue observation.
   * @param {MapMarker} newSelectedTree tree that was newly selected
   */
  public selectTree(newSelectedTree: MapMarker) {
    this.selectedTree = <TreeFrontend> newSelectedTree;
    this.loadSpec();
  }


  private loadSpec(): void {
    this.setStatus(StatusKey.SPEC, StatusValue.IN_PROGRESS);

    this.observationService.loadObservationSpec((types: Array<PhenologyObservationTypeFrontend>) => {
      for (let t of types) {
        if (types.length === 1) {
          t.containerCollapsed = false;
        }
        for (let r of t.results) {
          this.loadResultImage(r.id);
        }
      }
      this.checkProgress(true);
      this.setStatus(StatusKey.SPEC, StatusValue.SUCCESSFUL);
    }, (error, apiError) => {
      this.setStatus(StatusKey.SPEC, StatusValue.FAILED);
    });
  }

  private loadResultImage(resultId: number) {
    this.observationService.loadResultImg(resultId, () => {
    });
  }

  /**
   * Check observation step progress.
   */
  public checkProgress(observationChanged: boolean = false): void {

    // step 1 & 2
    if (this.availableTrees) {
      this.setStatus(StatusKey.STEP_TREE, StatusValue.SHOW);
      this.setStatus(StatusKey.STEP_TIME, StatusValue.SHOW);
    } else {
      this.setStatus(StatusKey.STEP_TREE, StatusValue.HIDE);
      this.setStatus(StatusKey.STEP_TIME, StatusValue.HIDE);
    }
    // step 3
    if (this.selectedTree) {
      this.setStatus(StatusKey.STEP_OBS, StatusValue.SHOW);
    } else {
      this.setStatus(StatusKey.STEP_OBS, StatusValue.HIDE);
    }

    // step 4
    if (this.hasStatus(StatusKey.STEP_OBS, StatusValue.SHOW) && this.isObservationsDone()) {
      this.setStatus(StatusKey.STEP_IMG, StatusValue.SHOW);
    } else {
      this.setStatus(StatusKey.STEP_IMG, StatusValue.HIDE);
    }

    // step 5
    if (this.hasStatus(StatusKey.STEP_IMG, StatusValue.SHOW) && this.isImgOk()) {
      this.setStatus(StatusKey.STEP_USERS, StatusValue.SHOW);
    } else {
      this.setStatus(StatusKey.STEP_USERS, StatusValue.HIDE);
    }

    const obsDone = this.isObservationsDone();
    const usersOk = this.isUsersOk();
    const imgOk = this.isImgOk();

    this.canSend = obsDone && usersOk && imgOk;

  }

  /**
   * Returns true if all observations are finished; false otherwise.
   */
  public isObservationsDone(): boolean {

    if (!this.selectedTree || !this.observationSpec) {
      return false;
    }

    for (let type of this.observationSpec) {
      if (!type.optional && type.objects.length > type.userObservations.length) {
        return false;
      }
    }
    return true;

  }

  /**
   * Returns true if observers are valid; false otherwise.
   */
  public isUsersOk(): boolean {
    return !this.authService.isUserAnonymous() ||
      (this.dataset.observers !== undefined &&
        this.dataset.observers.length >= 5 &&
        this.dataset.observers.length <= 200);
  }

  /**
   * Returns true if image is valid; false otherwise.
   */
  public isImgOk(): boolean {
    return this.getUserImageErrors().length === 0;
  }

  /**
   * Invoked when an observation result is clicked (or otherwise activated).
   * Adds observation(s) to the observation.
   * If the shift-key is pressed when this method is invoked,
   * all remaining results will be filled with the given object.
   * @see addObservationResult
   */
  public onObservationResultAction(event: any,
                                   collapseElement: any,
                                   type: PhenologyObservationTypeFrontend,
                                   result: PhenologyObservationResult): void {

    if (event instanceof MouseEvent && event.shiftKey) {
      for (let i = type.userObservations.length; i < type.objects.length; i++) {
        this.addObservationResult(collapseElement, type, result);
      }
    } else {
      this.addObservationResult(collapseElement, type, result);
    }

  }

  /**
   * Invoked when an observation result is right-clicked (or the context menu is otherwise opened).
   * @param event assoc event
   * @param type observation type on which the action occurred
   * @param result observation result on which the action occurred
   */
  public onObservationResultContextMenu(event: any,
                                        type: PhenologyObservationTypeFrontend,
                                        result: PhenologyObservationResult): void {

    this.undoObservationResult(type, result);

  }

  /**
   * Add a single observation result to this observation.
   */
  private addObservationResult(collapseElement: any,
                              type: PhenologyObservationTypeFrontend,
                              result: PhenologyObservationResult,
                              object?: PhenologyObservationObject): void {

    if (type.userObservations.length === type.objects.length) {
      ObservationComponent.LOG.trace('All objects have already been observed.');
      return;
    }

    let insertObj;
    if (object) {
      insertObj = object;
    } else {
      insertObj = type.objects[type.userObservations.length];
    }

    type.userObservations.push(
      new PhenologyObservation(insertObj, result)
    );

    if (type.userObservations.length === type.objects.length) {
      type.done = true;
      if (this.isObserveNow) {
        this.dataset.uiObservationDate = new Date();
      }

      if (!type.wasAutoCollapsed) {
        // collapseElement.hide(); testing ux, maybe we want the users to look at it again instead of discouraging it
        type.wasAutoCollapsed = true;
      }
    }

    this.checkProgress();

  }

  /**
   * Undo one or all observation results for a obs type.
   */
  public resetAllObservationResults(): void {

    if (!this.observationSpec) {
      return;
    }

    for (let t of this.observationSpec) {
      this.undoObservationResult(t, undefined, true);
    }

  }

  /**
   * Undo one or all observation results for a obs type.
   * If result is given, only remove observations of that result.
   */
  public undoObservationResult(type: PhenologyObservationTypeFrontend,
                               result?: PhenologyObservationResult,
                               all: boolean = false): void {
    if (type.userObservations.length === 0) {
      return;
    }
    if (all) {
      if (result) {
        if (type.userObservations.some(obs => obs.result === result)) {
          type.done = false;
        }
        type.userObservations = type.userObservations.filter(obs => obs.result === result);
      } else {
        type.userObservations = [];
        type.done = false;
      }
    } else {
      if (result) {
        let i = 0, r;
        for (let obs of type.userObservations) {
          if (obs.result.id === result.id) {
            r = i;
          }
          i++;
        }
        if (r !== undefined) {
          type.userObservations.splice(r, 1);
          type.done = false;
        }
      } else {
        type.userObservations = type.userObservations.slice(0, type.userObservations.length - 1);
        type.done = false;
      }
    }
    this.checkProgress();
  }

  /**
   * Return amount of observations for the given type and result.
   */
  public getObservationAmount(type: PhenologyObservationTypeFrontend,
                              result: PhenologyObservationResult): number {

    let amount = 0;
    for (let o of type.userObservations) {
      if (o.result === result) {
        amount++;
      }
    }
    return amount;

  }

  /**
   * Discard current observation state and reset to defaults.
   */
  public onDiscard(toStep: number = 1) {
    if (toStep <= 1) {
      this.observationService.reset();
      this.lastPhenologyId = undefined;
      this.deleteStatus(StatusKey.SEND_IMAGE);
      this.deleteStatus(StatusKey.SEND_DATA);
      this.deleteStatus(StatusKey.SEND_DATA_ERROR);
    }
    if (toStep <= 2) {
      this.isObserveNow = true;
    }
    if (toStep <= 3) {
      this.resetAllObservationResults();
    }
    if (toStep <= 4) {
      this.observationService.userImage = undefined;
    }
    if (toStep <= 5) {
      this.dataset.observersUserIdentities = new Set<UserIdentity>();
      this.addMoreObservers = false;
    }
    this.checkProgress();
  }

  /**
   * Prepares and submits all data using the observation service.
   */
  public onSubmit() {

    ObservationComponent.LOG.debug('Submitting phenology observation...');
    this.checkProgress();

    // commit observations
    this.observations = [];
    for (let type of this.observationSpec) {
      this.observations.push(...type.userObservations);
    }

    // set observation date
    this.dataset.apply(this.envService.outputDateFormat);

    // send observation data
    this.setStatus(StatusKey.SEND_DATA, StatusValue.IN_PROGRESS);
    this.deleteStatus(StatusKey.SEND_IMAGE);
    this.deleteStatus(StatusKey.SEND_DATA_ERROR);
    this.observationService.submit(phenologyId => {
      ObservationComponent.LOG.info('Phenology observation successfully sent.');
      this.lastPhenologyId = phenologyId;
      this.setStatus(StatusKey.SEND_DATA, StatusValue.SUCCESSFUL);
      this.checkProgress();

      // send user image
      this.sendUserImage(phenologyId);
    }, (error, apiError) => {
      ObservationComponent.LOG.info('Failed to send phenology observation.');
      this.setStatus(StatusKey.SEND_DATA, StatusValue.FAILED);
      if (apiError.clientErrorCode === 10) {
        this.setStatus(StatusKey.SEND_DATA_ERROR, StatusValue.DUPLICATE);
      }
    });

  }

  /**
   * Send user image to the backend.
   */
  public sendUserImage(phenologyId?: number): void {

    if (!phenologyId) {
      phenologyId = this.lastPhenologyId;
    }
    if (!phenologyId || !this.userImage) {
      this.onDiscard(3);
      this.rewardService.changes();
      return;
    }

    this.setStatus(StatusKey.SEND_IMAGE, StatusValue.IN_PROGRESS);
    this.observationService.submitImg(phenologyId, () => {
      ObservationComponent.LOG.info('Phenology observation image successfully sent.');
      this.setStatus(StatusKey.SEND_IMAGE, StatusValue.SUCCESSFUL);
      this.onDiscard(3);
      this.checkProgress();
      this.rewardService.changes();
    }, (error, apiError) => {
      ObservationComponent.LOG.info('Failed to send phenology observation image.');
      this.setStatus(StatusKey.SEND_IMAGE, StatusValue.FAILED);
    });

  }

  get images() {
    return this.observationService.images;
  }

  get observationSpec() {
    return this.observationService.observationSpec;
  }

  get observations() {
    return this.observationService.dataset.observations;
  }

  set observations(observations: Array<PhenologyObservation>) {
    this.observationService.dataset.observations = observations;
  }

  /**
   * Set the user upload image in the service.
   */
  public setUserImage(event: any) {
    ObservationComponent.LOG.info('Setting user image', event);
    this.observationService.userImage = event.target.files.item(0);
    this.checkProgress();
  }

  public isUserImageValid(): boolean {
    return this.getUserImageErrors().length === 0;
  }

  /**
   * Check if the image is valid and of the right type.
   * @returns {UserImageError[]} array of errors found or empty array.
   */
  public getUserImageErrors(): UserImageError[] {

    let errors = new Array<UserImageError>();
    if (!this.observationService.userImage) {
      return errors;
    }

    if (['image/jpeg', 'a/png'].indexOf(this.observationService.userImage.type) === -1) {
      errors.push(UserImageError.INVALID_TYPE);
    }
    if (this.userImage.size > 5242880) {
      errors.push(UserImageError.INVALID_SIZE);
    }
    return errors;

  }

  public observationInPast(): void {
    this.isObserveNow = false;
    this.observationService.observationInPast();
  }

  public calcObsXp(): number {
    let xp = ObservationComponent.PHENOBS_XP;
    if (this.userImage) {
      xp += ObservationComponent.PHENOBS_IMG_XP;
    }
    return Math.floor(xp / (this.dataset.observersUserIdentities.size + 1));
  }

  get userImageName(): String {
    if (!this.observationService.userImage) {
      return null;
    }
    return this.observationService.userImage.name;
  }

  get userImage(): any {
    return this.observationService.userImage;
  }

}

export enum StatusKey {

  TREES,
  SPEC,
  SEND_DATA,
  SEND_DATA_ERROR,
  SEND_IMAGE,
  // progress
  STEP_TREE,
  STEP_TIME,
  STEP_OBS,
  STEP_IMG,
  STEP_USERS

}

export enum StatusValue {

  HIDE,
  SHOW,
  DUPLICATE,
  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2

}

export enum UserImageError {
  INVALID_TYPE,
  INVALID_SIZE
}
