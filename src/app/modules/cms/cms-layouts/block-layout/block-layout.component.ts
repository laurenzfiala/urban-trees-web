import {
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
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
  selector: 'ut-cms-block-layout',
  templateUrl: './block-layout.component.html',
  styleUrls: ['./block-layout.component.less']
})
export class BlockLayout extends AbstractCmsLayout {

  // --- SLOTS ---
  public static SLOT_MAIN: string = 'slot';

  // -> SLOT_MAIN
  @ViewChild('slotMain', {read: ViewContainerRef})
  public slotMain: ViewContainerRef;
  private slotMainElement: MutableWrapper<CmsElement> = new MutableWrapper<CmsElement>();
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
      slot: this.serializationService.serializeElement(this.slotMainElement.get())
    };
  }

  public async deserialize(data: any): Promise<void> {
    const sCmp = this.serializationService.deserializeElement(data.slot);
    this.slotMainElement.set(await this.fillSlot(sCmp, () => this.slotMain));
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
