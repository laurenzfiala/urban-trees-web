import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {ContentService} from '../../services/content.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {ImageComponent} from '../../cms-components/image/image.component';
import {Mode} from '../../../shared/components/zoom/zoom.component';

@Component({
  selector: 'ut-cms-exp-days-layout',
  templateUrl: './exp-days.component.html',
  styleUrls: ['./exp-days.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpDaysLayout extends AbstractCmsLayout implements AfterViewInit {

  Mode = Mode;

  public ratingMax: number = 5;
  public ratingTemp: number = 0;
  public experiments: any[] = [
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/co2_pour.JPG', name: 'CO₂ Gießen', active: false},
    {img: '/assets/img/journal/expdays/experiments/co2_air.JPG', name: 'CO₂ in der Atemluft', active: false},
    {img: '/assets/img/journal/expdays/experiments/co2_mass.JPG', name: 'CO₂ Masse abwiegen', active: false},
    {img: '/assets/img/journal/expdays/experiments/co2_lake.JPG', name: 'CO₂ See', active: false},
    {img: '/assets/img/journal/expdays/experiments/hands.JPG', name: 'Die getäuschten Hände', active: false},
    {img: '/assets/img/journal/expdays/experiments/priestley.JPG', name: 'Priestley Experiment', active: false},
    {img: '/assets/img/journal/expdays/experiments/gap.JPG', name: 'Spaltöffnungen', active: false}
  ];

  // model
  public rating: number;
  public favouriteExperimentIndex: number;
  public learnedDescription: string;

  @ViewChild('picture', {read: ImageComponent})
  public picture: ImageComponent;

  constructor(private serializationService: SerializationService,
              protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              protected subs: SubscriptionManagerService) {
    super();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();
    this.onElementAdd(this.picture);
  }

  public serialize(): any {
    return {
      rating: this.rating,
      favouriteExperimentIndex: this.favouriteExperimentIndex,
      learnedDescription: this.learnedDescription,
      picture: this.picture.hasFile() ? this.serializationService.serializeElement(this.picture) : null
    };
  }

  public async deserialize(data: any): Promise<void> {
    this.rating = data.rating;
    this.favouriteExperimentIndex = data.favouriteExperimentIndex;
    this.learnedDescription = data.learnedDescription;
    await this.picture.deserialize(this.serializationService.deserializeElement(data.picture));
    this.update();
    return Promise.resolve();
  }

  public getName(): string {
    return this.constructor.name;
  }

  public validate(results: CmsValidationResults) {
  }

}
