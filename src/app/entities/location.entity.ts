import {Coordinates} from './coordinates.entity';
import {City} from './city.entity';

/**
 * Describes the location of a tree, beacon etc.
 *
 * @author Laurenz Fiala
 * @since 2018/02/14
 */
export class Location {

  public id: number;

  public coordinates: Coordinates;
  public street: string;
  public city: City;

  constructor(id?: number,
              coordinates?: Coordinates,
              street?: string,
              city?: City) {
    this.id = id;
    this.coordinates = coordinates;
    this.street = street;
    this.city = city;
  }

  public static fromObject(o: any): Location {

    return new Location(
      o.id,
      Coordinates.fromObject(o.coordinates),
      o.street,
      City.fromObject(o.city)
    );

  }

}
