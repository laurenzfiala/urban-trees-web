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
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {SubscriptionManagerService} from '../../../trees/services/subscription-manager.service';

@Component({
  selector: 'ut-cms-two-column-layout',
  templateUrl: './two-column-layout.component.html',
  styleUrls: ['./two-column-layout.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TwoColumnLayout extends AbstractCmsLayout {

  // --- SLOTS ---
  public static SLOT_LEFT: string = 'left';
  public static SLOT_RIGHT: string = 'right';

  // -> SLOT_LEFT
  @ViewChild('slotLeft', {read: ViewContainerRef})
  public slotLeft: ViewContainerRef;
  private slotLeftElement: MutableWrapper<CmsElement> = new MutableWrapper<CmsElement>();
  // <-

  // -> SLOT_RIGHT
  @ViewChild('slotRight', {read: ViewContainerRef})
  public slotRight: ViewContainerRef;
  private slotRightElement: MutableWrapper<CmsElement> = new MutableWrapper<CmsElement>();
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
      slotLeft: this.serializationService.serializeElement(this.slotLeftElement.get()),
      slotRight: this.serializationService.serializeElement(this.slotRightElement.get())
    };
  }

  public async deserialize(data: any): Promise<void> {
    const slotLeftCmp = this.serializationService.deserializeElement(data.slotLeft);
    this.slotLeftElement.set(await this.fillSlot(() => this.slotLeft, slotLeftCmp));
    this.onElementAdd(this.slotLeftElement.get());
    const slotRightCmp = this.serializationService.deserializeElement(data.slotRight);
    this.slotRightElement.set(await this.fillSlot(() => this.slotRight, slotRightCmp));
    this.onElementAdd(this.slotRightElement.get());
    this.update();
  }

  public getName(): string {
    return this.constructor.name;
  }

  public validate(results: CmsValidationResults) {

    if (!this.slotLeftElement.get()) {
      const r = results.addResult(new CmsValidationResult(true, 'Left slot may not be empty'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error'); // TODO
      });
    }

    if (!this.slotRightElement.get()) {
      const r = results.addResult(new CmsValidationResult(true, 'Right slot may not be empty'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error'); // TODO
      });
    }

  }

}
