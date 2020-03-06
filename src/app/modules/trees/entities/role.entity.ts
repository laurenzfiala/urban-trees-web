/**
 * User's auth role.
 *
 * @author Laurenz Fiala
 * @since 2019/01/31
 */
export class Role {

  public id: number;
  public name: string;

  public checked: boolean = false;

  constructor(id: number,
              name: string) {
    this.id = id;
    this.name = name;
  }

  public toString(): string {
    return this.name.split('_')[1];
  }

  public static fromObject(o: any): Role {

    return new Role(
      o.id,
      o.name
    );

  }

}
