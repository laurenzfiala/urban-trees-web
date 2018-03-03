import {Component, EventEmitter, Input, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {ActivatedRoute, ChildActivationStart, NavigationStart, Router} from '@angular/router';
import {AInfoComponent} from './a-info/a-info.component';
import {BObservationComponent} from './b-observation/b-observation.component';
import {CUploadComponent} from './c-upload/c-upload.component';
import {DFinishComponent} from './d-finish/d-finish.component';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';
import {SubscriptionManagerService} from '../../../services/subscription-manager.service';
import {Log} from '../../../services/log.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {AbstractComponent} from '../../abstract.component';

@Component({
  selector: 'ut-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.less']
})
export class ObservationComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(BObservationComponent);

  private static SUBSCRIPTION_TAG = 'observation-cmp';

  public stepItems: MenuItem[] = [];

  constructor(private observationService: PhenologyObservationService,
              private subs: SubscriptionManagerService,
              private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService) { }

  public ngOnInit() {

    ObservationComponent.LOG.trace('Initializing...');

    this.initSteps();

    if (!this.route.children) {
      ObservationComponent.LOG.debug('Found no child routes.');
      return;
    }


    this.checkStepIndex();
    this.observationService.checkStepPreconditions();

    this.subs.register(this.router.events.subscribe((e: any) => {
      if (e instanceof ChildActivationStart) {
        const url = e.snapshot.children[0].url[0].path;
        if (url) {
          let n = Number(url) - 1;
          this.observationService.currentStepIndex = n;
        }
      }
    }), ObservationComponent.SUBSCRIPTION_TAG);

  }

  /**
   * Setup steps for translation.
   */
  private initSteps() {
    this.stepItems = this.observationService.getMenuItems();
    this.subs.register(this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      ObservationComponent.LOG.trace('Getting observation steps...');
      this.stepItems = this.observationService.getMenuItems();
    }), ObservationComponent.SUBSCRIPTION_TAG);
  }

  /**
   * Check which step is currently active by the current routes'
   * component type and set the appropriate index in the service.
   */
  private checkStepIndex() {

    let child = this.route.children[0].component;

    if (child === AInfoComponent) {
      this.observationService.currentStepIndex = 0;
    } else if (child === BObservationComponent) {
      this.observationService.currentStepIndex = 1;
    } else if (child === CUploadComponent) {
      this.observationService.currentStepIndex = 2;
    } else if (child === DFinishComponent) {
      this.observationService.currentStepIndex = 3;
    }

  }

  public ngOnDestroy() {
    ObservationComponent.LOG.trace('Destroying phenology observation...');
    this.subs.unsubscribe(ObservationComponent.SUBSCRIPTION_TAG);
  }

  get currentStep() {
    return this.observationService.currentStep;
  }

  get currentStepIndex(): number {
    return this.observationService.currentStepIndex;
  }

  get nextStep() {
    return this.observationService.nextStep;
  }

  get previousStep() {
    return this.observationService.previousStep;
  }

  get isObservationSpecLoaded(): boolean {
    return this.observationService.observationSpec !== undefined;
  }
}
