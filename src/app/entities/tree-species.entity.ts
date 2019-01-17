/**
 * TreeSpecies of a tree.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
import {TreeGenus} from './tree-genus.entity';

export class TreeSpecies {

  public id: number;
  public name: string;
  public genus: TreeGenus;

  constructor(
    id: number,
    name: string,
    genus: TreeGenus
  ) {
    this.id = id;
    this.genus = genus;
    this.name = name;
  }

  public static fromObject(o: any): TreeSpecies {

    return new TreeSpecies(
      o.id,
      o.name,
      TreeGenus.fromObject(o.genus)
    );

  }

  /**
   * Compare two species to each other.
   * If one or both of the species are falsy, false is returned.
   */
  public static equals(a: TreeSpecies, b: TreeSpecies) {
    return a && b && a.id === b.id;
  }

}
