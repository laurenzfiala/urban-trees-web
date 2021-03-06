import {search} from '../decorators/search.decorator';

/**
 * City.
 *
 * @author Laurenz Fiala
 * @since 2018/12/05
 */
export class City {

  /**
   * Note: ID need not be populated when POST-ing a new city to the backend:
   */
  @search(undefined, undefined, 'cityid')
  public id: number;

  /**
   * Name of the city.
   */
  @search(undefined, undefined, 'city')
  public name: string;

  constructor(
    name: string,
    id?: number
  ) {
    this.id = id;
    this.name = name;
  }

  public static fromObject(o: any): City {

    return new City(
      o.name,
      o.id
    );

  }

  /**
   * Compare two cities to each other.
   * If one or both of the cities are falsy, false is returned.
   */
  public static equals(a: City, b: City) {
    return a && b && ((a === b) || (a.id === b.id));
  }

}
