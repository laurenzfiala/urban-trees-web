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
  public id: number;

  /**
   * Name of the city.
   */
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
      o.id,
      o.name
    );

  }

}
