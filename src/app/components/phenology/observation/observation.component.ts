import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BObservationComponent} from './b-observation/b-observation.component';
import {PhenologyObservationService} from '../../../services/phenology/observation/phenology-observation.service';
import {SubscriptionManagerService} from '../../../services/subscription-manager.service';
import {Log} from '../../../services/log.service';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.less']
})
export class ObservationComponent implements OnInit, OnDestroy {

  private static LOG: Log = Log.newInstance(BObservationComponent);

  private static SUBSCRIPTION_TAG = 'observation-cmp';

  /**
   * This array contains all available steps for phenology observation
   * with their corresponding path and title.
   */
  public static steps: any[] = [
    {
      routerLink: '1',
      label: 'Tree'
    },
    {
      routerLink: '2',
      label: 'Observation'
    },
    {
      routerLink: '3',
      label: 'Documentation'
    },
    {
      routerLink: '4',
      label: 'Review'
    }
  ];

  /**
   * Needed for template.
   */
  public stepItems = ObservationComponent.steps;

  constructor(private observationService: PhenologyObservationService,
              private subs: SubscriptionManagerService,
              private route: ActivatedRoute,
              private router: Router,
              private translateService: TranslateService) { }

  public ngOnInit() {
    ObservationComponent.LOG.trace('Initializing...');
    this.initSteps();
  }

  /**
   * Setup steps for translation.
   */
  private initSteps() {
    this.subs.register(this.translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      for (let i = 0; i < ObservationComponent.steps.length; i++) {
        this.translateService.get('phenology.observation.navigation.step' + ObservationComponent.steps[i].routerLink).subscribe((translated: string) => {
          ObservationComponent.steps[i].label = translated;
        });
      }
    }), ObservationComponent.SUBSCRIPTION_TAG);
  }

  public ngOnDestroy() {
    ObservationComponent.LOG.trace('Destroying phenology observation...');
    this.subs.unsubscribe(ObservationComponent.SUBSCRIPTION_TAG);
  }

  get currentStepIndex(): number {
    return this.observationService.currentStepIndex;
  }

  get finishedStepIndex(): number {
    return this.observationService.finishedStepIndex;
  }

  get currentStep(): any {
    return ObservationComponent.steps[this.observationService.currentStepIndex];
  }

  get nextStep(): any {
    return ObservationComponent.steps[this.observationService.currentStepIndex + 1];
  }

  get previousStep(): any {
    return ObservationComponent.steps[this.observationService.currentStepIndex - 1];
  }

  public isPreviousStepAllowed(): boolean {
    if (this.previousStep) {
      return true;
    }
    return false;
  }

  public isNextStepAllowed(): boolean {
    return this.nextStep && this.finishedStepIndex >= this.currentStepIndex;
  }

}
