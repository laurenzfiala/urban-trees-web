import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';
import {EnvironmentService} from '../../../shared/services/environment.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'ut-cms-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent extends AbstractCmsComponent {

  public StatusKey = StatusKey;
  public StatusValue = StatusValue;

  public fileUid: number;
  public filename: string;

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef,
              protected translate: TranslateService,
              private envService: EnvironmentService) {
    super();
  }

  public uploadFile(event: any): void {

    let file = event.target.files.item(0);
    this.filename = file.name;

    this.setStatus(StatusKey.UPLOAD, StatusValue.IN_PROGRESS);
    this.contentService.saveContentFile(
      this.contentPath().value,
      file,
      fileId => {
        this.fileUid = fileId;
        this.setStatus(StatusKey.UPLOAD, StatusValue.SUCCESSFUL);
        this.changed();
        this.cdRef.markForCheck();
      },
      (error, apiError) => {
        this.setStatus(StatusKey.UPLOAD, StatusValue.FAILED, apiError);
        this.cdRef.markForCheck();
      }
    );

  }

  public deleteFile(): void {
    this.fileUid = undefined;
    this.filename = undefined;
    this.cdRef.markForCheck();
  }

  public getFileUrl(): string {
    return this.envService.endpoints.loadContentFile(this.fileUid, this.contentPath().value, this.filename);
  }

  /**
   * Whether this component contains a file or not.
   */
  public hasFile(): boolean {
    return this.fileUid !== undefined;
  }

  public async deserialize(serialized: any): Promise<void> {
    if (!serialized) {
      return Promise.resolve();
    }
    const state = serialized;
    this.fileUid = Number.parseInt(state.fileUid, 10);
    this.filename = state.filename;
    this.changed();
  }

  public serialize(): any {
    return {
      fileUid: this.fileUid,
      filename: this.filename
    };
  }

  public getName(): string {
    return this.constructor.name;
  }

  public getToolbarContextual(): ToolbarSection<ToolbarElement> {
    return new ToolbarSection<ToolbarElement>();
  }

  public validate(results?: CmsValidationResults): CmsValidationResults {

    this.validationResults.reset();
    if (!this.fileUid) {
      const result = new CmsValidationResult(true, this.translate.get('components.file.validation.empty'));
      result.onHighlight().subscribe(value => {
        this.cdRef.detectChanges();
      });

      this.validationResults.addResult(result);
      results?.addResult(result);
    }
    return this.validationResults;

  }

}

export enum StatusKey {
  UPLOAD
}

export enum StatusValue {
  IN_PROGRESS = 0,
  SUCCESSFUL = 1,
  FAILED = 2
}
