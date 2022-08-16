import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {ContentService} from '../../services/content.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';
import {ImageComponent} from '../../cms-components/image/image.component';

@Component({
  selector: 'ut-cms-sensor-to-app-layout',
  templateUrl: './sensor-to-app.component.html',
  styleUrls: ['./sensor-to-app.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SensorToAppLayout extends AbstractCmsLayout implements AfterViewInit {

  public ratingMax: number = 5;
  public ratingTemp: number = 0;
  public experiments: any[] = [
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false},
    {img: '/assets/img/journal/expdays/experiments/leaves_in_plastic.JPG', name: 'Blätter im Plastiksack', active: false}
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
