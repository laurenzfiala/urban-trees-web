import {City} from './city.entity';
import {search} from '../decorators/search.decorator';

/**
 * Describes the location of a tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Coordinates {

  @search('tree-list')
  public x: number;

  @search('tree-list')
  public y: number;

  @search('tree-list')
  public projection: string;

  constructor(x: number,
              y: number,
              projection?: string) {
    this.x = x;
    this.y = y;
    this.projection = projection;
  }

  public static fromObject(o: any): Coordinates {

    return new Coordinates(
      o.x,
      o.y,
      o.projection
    );

  }

}
