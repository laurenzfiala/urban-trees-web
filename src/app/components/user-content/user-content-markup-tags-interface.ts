/**
 * Interface for markup tags.
 *
 * @see UserContentComponent
 * @author Laurenz Fiala
 * @since 2019/03/12
 */
export interface MarkupTagInterface {

  parse(markup: string): string;
  attribute(attributeMap: Map<string, string>): void;

}

export abstract class AbstractMarkupTag implements MarkupTagInterface {

  abstract parse(markup: string): string;
  attribute(attributeMap: Map<string, string>): void {}

}
