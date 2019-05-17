import {Component, EventEmitter, Input, OnInit, Output, SecurityContext} from '@angular/core';
import {State} from './user-content-state';
import {MarkupTagInterface} from './user-content-markup-tags-interface';
import {
  MarkupTagBold, MarkupTagColor, MarkupTagInvalid,
  MarkupTagList,
  MarkupTagListItem,
  MarkupTagParagraph,
  MarkupTagTitle, MarkupTagUnderline
} from './user-content-markup-tags';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {TreeFrontend} from '../../entities/tree-frontend.entity';
import {UserContent} from '../../entities/user-content.entity';
import {Log} from '../../services/log.service';

@Component({
  selector: 'ut-user-content',
  templateUrl: './user-content.component.html',
  styleUrls: ['./user-content.component.less']
})
export class UserContentComponent {

  private static LOG: Log = Log.newInstance(UserContentComponent);

  @Output()
  public state: EventEmitter<State> = new EventEmitter<State>();

  @Input()
  set addTags(tags: Map<string, MarkupTagInterface>) {
    if (!tags) {
      return;
    }
    tags.forEach((value, key) => {
      this.tags.set(key, value);
    });
  }

  public tags: Map<string, MarkupTagInterface> = new Map<string, MarkupTagInterface>();

  public _content: UserContent;

  @Input()
  set content(c: UserContent) {
    this._content = c;
    this.sanitizeContent();
    this.parseContent(c.content);
    this.state.emit(State.READY);
  }

  /**
   * Holds the markup content to parse once state is PARSING.
   */
  public loadedContent: string;

  /**
   * Holds the html content to display once state is READY.
   */
  public parsedContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    this.initTags();
  }

  private sanitizeContent(): void {
    this.loadedContent = this.sanitizer.sanitize(SecurityContext.HTML, this.loadedContent);
  }

  private initTags(): void {
    this.tags.set('title',     new MarkupTagTitle());
    this.tags.set('paragraph', new MarkupTagParagraph());
    this.tags.set('list-item', new MarkupTagListItem());
    this.tags.set('list',      new MarkupTagList());
    this.tags.set('bold',      new MarkupTagBold());
    this.tags.set('color',     new MarkupTagColor());
    this.tags.set('underline', new MarkupTagUnderline());
  }

  private parseContent(markup: string): void {

    this.state.emit(State.PARSING);

    const openingTagPositionsRegex = /\[([a-z\-]+)(?:\s+([a-z]+)=&#34;(.*?)&#34;)*\]/gm; // &#34; == "
    const closingTagPositionsRegex = /\[\/([a-z\-]+)\]/gm;
    const tagAmount = (markup.match(openingTagPositionsRegex) || []).length;

    while (true) {

      let currentTagPos, openingTagPositions = [], closingTagPositions = [];
      while ((currentTagPos = openingTagPositionsRegex.exec(markup)) != null) {
        openingTagPositions.push(currentTagPos);
      }
      while ((currentTagPos = closingTagPositionsRegex.exec(markup)) != null) {
        closingTagPositions.push(currentTagPos);
      }

      if (closingTagPositions.length === 0) {
        this.parsedContent = this.sanitizer.bypassSecurityTrustHtml(markup);
        return;
      }

      let openingTag;
      for (let j = openingTagPositions.length-1; j >= 0; j--) {
        if (openingTagPositions[j].index < closingTagPositions[0].index) {
          openingTag = openingTagPositions[j];
          break;
        }
      }

      let tag: MarkupTagInterface = this.getTag(closingTagPositions[0]['1']);
      if (!tag) {
        UserContentComponent.LOG.debug('Invalid tag encountered in ' + this._content.toString());
        tag = new MarkupTagInvalid();
      }

      let currentKey, currentVal, attrMap = new Map<string, string>();
      for (let i = 3; i < openingTag.length; i += 2) {
        currentKey = openingTag['' + (i-1)];
        currentVal = openingTag['' + i];
        if (currentKey && currentVal) {
          attrMap.set(currentKey, currentVal);
        }
      }
      tag.attribute(attrMap);

      markup = markup.substring(0, openingTag.index)
        + tag.parse(markup.substring(openingTag.index + openingTag['0'].length, closingTagPositions[0].index))
        + markup.substring(closingTagPositions[0].index + closingTagPositions[0]['0'].length);

    }

  }

  private getTag(tag: string): MarkupTagInterface {
    return this.tags.get(tag);
  }

}
