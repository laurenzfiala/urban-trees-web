/**
 * Species of a tree.
 *
 * @author Laurenz Fiala
 * @since 2018/12/04
 */
export class Species {

  public id: number;
  public genusId: number;
  public name: string;

  constructor(
    id: number,
    genusId: number,
    name: string
  ) {
    this.id = id;
    this.genusId = genusId;
    this.name = name;
  }

  public static fromObject(o: any): Species {

    return new Species(
      o.id,
      o.genusId,
      o.name
    );

  }

}
