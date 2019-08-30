import {City} from './city.entity';

/**
 * Describes the location of a tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Coordinates {

  public x: number;
  public y: number;
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
