/**
 * TODO
 *
 * @author Laurenz Fiala
 * @since 2018/02/22
 */
export class Announcement {

  public id: number;
  public title: string;
  public description: string;
  public severity: number;

  constructor(id: number, title: string, description: string, severity: number) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.severity = severity;
  }

  public static fromObject(o: any): Announcement {

    return new Announcement(
      o.id,
      o.title,
      o.description,
      o.severity
    );

  }

}
