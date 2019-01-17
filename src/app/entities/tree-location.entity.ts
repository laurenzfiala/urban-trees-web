import {Coordinates} from './coordinates.entity';
import {City} from './city.entity';

/**
 * Describes the location of a tree.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class TreeLocation {

  public id: number;

  public coordinates: Coordinates;
  public street: string;
  public city: City;

  constructor(id: number,
              coordinates: Coordinates,
              street: string,
              city: City) {
    this.id = id;
    this.coordinates = coordinates;
    this.street = street;
    this.city = city;
  }

  public static fromObject(o: any): TreeLocation {

    return new TreeLocation(
      o.id,
      Coordinates.fromObject(o.coordinates),
      o.street,
      City.fromObject(o.city)
    );

  }

}
