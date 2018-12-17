import {Coordinates} from './coordinates.entity';

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
  public city: string;

  constructor(id: number,
              coordinates: Coordinates,
              street: string,
              city: string) {
    this.id = id;
    this.coordinates = coordinates;
    this.street = street;
    this.city = city;
  }

}
