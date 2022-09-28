import { Component, OnInit } from '@angular/core';
import {UserContent} from '../../../cms/entities/user-content.entity';
import {ContentService} from '../../../cms/services/content.service';
import {UserContents} from '../../../cms/entities/user-contents.entity';
import {ViewMode} from '../../../cms/enums/cms-layout-view-mode.enum';
import {EnvironmentService} from '../../../shared/services/environment.service';

@Component({
  selector: 'ut-methodbox',
  templateUrl: './methodbox.component.html',
  styleUrls: ['./methodbox.component.less']
})
export class MethodboxComponent implements OnInit {

  UserContent = UserContent;
  ViewMode = ViewMode;

  public content!: UserContent;
  public contentViewMode: ViewMode = ViewMode.CONTENT;

  constructor(private contentService: ContentService,
              public envService: EnvironmentService) { }

  ngOnInit(): void {
    this.loadContent();
  }

  public loadContent(): void {
    this.contentService.loadContent('/methodbox', 'de-DE', contents => {
      this.content = UserContents.single(contents);
    });
  }

}
