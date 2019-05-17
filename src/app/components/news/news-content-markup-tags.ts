/**
 * All markup tags.
 *
 * @see UserContentComponent
 * @author Laurenz Fiala
 * @since 2019/03/12
 */
import {AbstractMarkupTag, MarkupTagInterface} from './../user-content/user-content-markup-tags-interface';

export class MarkupTagNewsTitleContainer extends AbstractMarkupTag {
  public parse(markup: string): string {
    return '<div class="title-container">' + markup + '</div>';
  }
}

export class MarkupTagNewsTitle extends AbstractMarkupTag {
  public parse(markup: string): string {
    return '<div class="title">' + markup + '</div>';
  }
}

export class MarkupTagNewsAnnotations extends AbstractMarkupTag {
  public parse(markup: string): string {
    return '<div class="annotations">' + markup + '</div>';
  }
}

export class MarkupTagNewsTimestamp extends AbstractMarkupTag {
  public parse(markup: string): string {
    return '<div class="annotation timestamp">' + markup + '</div>';
  }
}

export class MarkupTagNewsContent extends AbstractMarkupTag {
  public parse(markup: string): string {
    return '<div class="content">' + markup + '</div>';
  }
}
