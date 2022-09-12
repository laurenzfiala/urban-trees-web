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
import {TranslateService} from '@ngx-translate/core';

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
              translate: TranslateService,
              envService: EnvironmentService) {
    super(contentService, toolbar, cdRef, translate, envService);
  }

  public selectImage(): void {
    this.fileInput.nativeElement.click();
  }

  public getName(): string {
    return this.constructor.name;
  }

  public validate(results?: CmsValidationResults): CmsValidationResults {

    this.validationResults.reset();
    if (!this.fileUid) {
      const result = new CmsValidationResult(true, this.translate.get('components.img.validation.empty'));
      result.onHighlight().subscribe(value => {
        this.cdRef.detectChanges();
      });

      this.validationResults.addResult(result);
      results?.addResult(result);
    }
    return this.validationResults;

  }

}
