import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ToolbarElement, ToolbarSection} from '../../entities/toolbar.entity';
import {AbstractCmsComponent} from '../../entities/abstract-cms-component.entity';
import {ToolbarService} from '../../services/toolbar.service';
import {CmsValidationResults} from '../../entities/cms-validation-results.entity';
import {CmsValidationResult} from '../../entities/cms-validation-result.entity';
import {ContentService} from '../../services/content.service';

@Component({
  selector: 'ut-cms-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent extends AbstractCmsComponent {

  public fileUid: number;

  constructor(protected contentService: ContentService,
              protected toolbar: ToolbarService,
              protected cdRef: ChangeDetectorRef) {
    super();
  }

  public async deserialize(serialized: any): Promise<void> {
    const state = serialized;
    this.fileUid = Number.parseInt(state.fileUid, 10);
  }

  public serialize(): any {
    return {
      fileUid: this.fileUid
    };
  }

  public getName(): string {
    return this.constructor.name;
  }

  public getToolbarContextual(): ToolbarSection<ToolbarElement> {

    return new ToolbarSection<ToolbarElement>();

  }

  public validate(results: CmsValidationResults): void {

    if (!this.fileUid) {
      const r = results.addResult(new CmsValidationResult(true, 'errors.components.file.fileUid_is_falsy'));
      r.onHighlight().subscribe(value => {
        window.alert('highlight error in file component');
      });
    }

  }

}
