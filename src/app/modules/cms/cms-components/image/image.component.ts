import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {FileComponent} from '../file/file.component';

@Component({
  selector: 'ut-cms-img',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImageComponent extends FileComponent {

  @ViewChild('fileInput')
  private fileInput: ElementRef;

  constructor(contentService: ContentService,
              toolbar: ToolbarService,
              cdRef: ChangeDetectorRef,
              envService: EnvironmentService) {
    super(contentService, toolbar, cdRef, envService);
  }

  public selectImage(): void {
    this.fileInput.nativeElement.click();
  }

  public getName(): string {
    return this.constructor.name;
  }

}
