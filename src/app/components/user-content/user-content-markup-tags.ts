/**
 * All markup tags.
 *
 * @see UserContentComponent
 * @author Laurenz Fiala
 * @since 2019/03/12
 */
import {AbstractMarkupTag, MarkupTagInterface} from './user-content-markup-tags-interface';

export class MarkupTagTitle extends AbstractMarkupTag {

  public parse(markup: string): string {
    return '<h4>' + markup + '</h4>'; // TODO change to div
  }

}

export class MarkupTagParagraph extends AbstractMarkupTag {

  public tag(): string {
    return 'paragraph';
  }

  public parse(markup: string): string {
    return '<p>' + markup + '</p>';
  }

}

export class MarkupTagListItem extends AbstractMarkupTag {

  public tag(): string {
    return 'list-item';
  }

  public parse(markup: string): string {
    return '<li>' + markup + '</li>';
  }

}

export class MarkupTagList extends AbstractMarkupTag {

  private isOrdered: boolean;

  public attribute(attributeMap: Map<string, string>): void {
    const typeAttr = attributeMap.get('type');
    if (typeAttr === 'ordered') {
      this.isOrdered = true;
    }
  }

  public parse(markup: string): string {
    if (this.isOrdered) {
      return '<ol>' + markup + '</ol>';
    }
    return '<ul>' + markup + '</ul>';
  }

}

export class MarkupTagBold extends AbstractMarkupTag {

  public parse(markup: string): string {
    return '<b>' + markup + '</b>';
  }

}

export class MarkupTagColor extends AbstractMarkupTag {

  private color: string;

  public attribute(attributeMap: Map<string, string>): void {
    const colorAttr = attributeMap.get('color');
    if (colorAttr) {
      this.color = colorAttr;
    }
  }

  public parse(markup: string): string {
    if (this.color) {
      return '<span style="color: ' + this.color + '">' +  markup + '</span>';
    }
    return markup;
  }

}

export class MarkupTagUnderline extends AbstractMarkupTag {

  public parse(markup: string): string {
    return '<span style="text-decoration: underline">' +  markup + '</span>';
  }

}
