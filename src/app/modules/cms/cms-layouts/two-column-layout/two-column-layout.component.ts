import {ChangeDetectorRef, Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {CmsComponent} from '../../interfaces/cms-component.interface';
import {CmsLayoutSlot} from '../../entities/layout-slot.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entities';
import {SerializationService} from '../../services/serialization.service';
import {AbstractCmsLayout} from '../../entities/abstract-cms-layout.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsElement} from '../../interfaces/cms-element.interface';
import {ContentService} from '../../services/content.service';
import {MutableWrapper} from '../../entities/mutable-wrapper.entity';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';

@Component({
  selector: 'ut-cms-two-column-layout',
  templateUrl: './two-column-layout.component.html',
  styleUrls: ['./two-column-layout.component.less']
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
              protected resolver: ComponentFactoryResolver) {
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
    this.slotLeftElement.set(await this.fillSlot(slotLeftCmp, () => this.slotLeft));
    const slotRightCmp = this.serializationService.deserializeElement(data.slotRight);
    this.slotRightElement.set(await this.fillSlot(slotRightCmp, () => this.slotRight));
    this.update();
  }

  public getName(): string {
    return this.constructor.name;
  }

  validate(): Array<CmsValidationResult> {
    return undefined;
  }

  view(mode: ViewMode): void {

  }

}
