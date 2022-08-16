import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {SerializationService} from '../../services/serialization.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsElement} from '../../interfaces/cms-element.interface';
import {ContentService} from '../../services/content.service';
import {MutableWrapper} from '../../entities/mutable-wrapper.entity';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';

@Component({
  selector: 'ut-cms-block-layout',
  templateUrl: './block-layout.component.html',
  styleUrls: ['./block-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockLayout extends AbstractCmsLayout {

  // --- SLOTS ---
  public static SLOT_MAIN: string = 'slot';

  // -> SLOT_MAIN
  @ViewChild('slotMain', {read: ViewContainerRef})
  public slotMain: ViewContainerRef;
  public slotMainElement: MutableWrapper<CmsElement> = new MutableWrapper<CmsElement>();
  // <-

  constructor(private serializationService: SerializationService,
              protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              protected subs: SubscriptionManagerService) {
    super();
  }

  public serialize(): any {
    return {
      slot: this.serializationService.serializeElement(this.slotMainElement.get())
    };
  }

  public async deserialize(data: any): Promise<void> {
    const sCmp = this.serializationService.deserializeElement(data.slot);
    const element = await this.fillSlot(() => this.slotMain, sCmp, true);
    this.slotMainElement.set(element);
    this.update();
  }

  public getName(): string {
    return this.constructor.name;
  }

  public validate(results: CmsValidationResults) {

    if (!this.slotMainElement.get()) {
      const r = results.addResult(new CmsValidationResult(true, 'Slot may not be empty'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error in text component');
      });
    }

  }

}
