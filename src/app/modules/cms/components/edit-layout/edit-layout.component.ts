import {Component, Input, OnInit} from '@angular/core';
import {ContentService} from '../../services/content.service';
import {CmsLayout} from '../../interfaces/cms-layout.interface';
import {ViewMode} from '../../enums/cms-layout-view-mode.enum';

@Component({
  selector: 'ut-edit-layout',
  templateUrl: './edit-layout.component.html',
  styleUrls: ['./edit-layout.component.less']
})
export class EditLayoutComponent implements OnInit {

  ViewMode = ViewMode;

  @Input('layout')
  private layout: CmsLayout;

  constructor(private contentService: ContentService) { }

  ngOnInit(): void {
  }

  public remove(): void {
    this.contentService.elementRemove(this.layout);
  }

  /**
   * Returns true if the service signals that this
   * component should display itself in ANY of the
   * given view modes.
   * @param modes view modes: if ANY of these match, return true
   */
  public hasViewMode(...modes: ViewMode[]): boolean {
    return modes.includes(this.contentService.viewMode);
  }

}
