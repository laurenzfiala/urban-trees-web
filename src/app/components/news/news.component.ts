import { Component, OnInit } from '@angular/core';
import {MarkupTagInterface} from '../user-content/user-content-markup-tags-interface';
import {
  MarkupTagNewsAnnotations, MarkupTagNewsContent, MarkupTagNewsTimestamp,
  MarkupTagNewsTitle,
  MarkupTagNewsTitleContainer
} from './news-content-markup-tags';
import {UserContent} from '../../entities/user-content.entity';
import {UserContentService} from '../../services/user-content.service';
import {TreeListStatistics} from '../../entities/tree-list-statistics.entity';
import {StatusKey, StatusValue} from '../tree-list/tree-list.component';

@Component({
  selector: 'ut-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.less']
})
export class NewsComponent implements OnInit {

  public tags: Map<string, MarkupTagInterface>;

  public newsContent: Array<UserContent> = new Array<UserContent>();

  constructor(private contentService: UserContentService) { }

  public ngOnInit(): void {
    this.initTags();
    this.loadNews();
  }

  private initTags(): void {

    if (this.tags) {
      return;
    }

    this.tags = new Map<string, MarkupTagInterface>();
    this.tags.set('title-container', new MarkupTagNewsTitleContainer());
    this.tags.set('title', new MarkupTagNewsTitle());
    this.tags.set('annotations', new MarkupTagNewsAnnotations());
    this.tags.set('timestamp', new MarkupTagNewsTimestamp());
    this.tags.set('content', new MarkupTagNewsContent());

  }

  private loadNews(): void {

    this.contentService.loadContentByTag('NEWS', (contentList: Array<UserContent>) => {
      this.newsContent = contentList;
      //this.setStatus(StatusKey.STATISTICS, StatusValue.SUCCESSFUL);
    }, () => {
      //this.setStatus(StatusKey.STATISTICS, StatusValue.FAILED);
    });

  }

}
