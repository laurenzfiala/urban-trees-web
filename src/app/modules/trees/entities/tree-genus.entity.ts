/**
 * TreeGenus of a tree's species.
 *
 * @author Laurenz Fiala
 * @since 2018/12/29
 */
export class TreeGenus {

  public id: number;
  public name: string;

  constructor(
    id: number,
    name: string
  ) {
    this.id = id;
    this.name = name;
  }

  public static fromObject(o: any): TreeGenus {

    return new TreeGenus(
      o.id,
      o.name
    );

  }

}
