import * as moment from 'moment/moment';
import {environment} from '../../environments/environment';
import {UserContentLanguage} from './user-content-language.entity';

/**
 * Custom user content form db.
 *
 * @author Laurenz Fiala
 * @since 2019/03/15
 */
export class UserContent {

  public id: number;
  public content: string;
  public language: UserContentLanguage;
  public tag: string;
  public modDate: Date;

  constructor(id?: number,
              content?: string,
              language?: UserContentLanguage,
              tag?: string,
              modDate?: string) {
    this.id = id;
    this.content = content;
    this.language = language;
    this.tag = tag;
    if (modDate) {
      this.modDate = moment.utc(modDate, environment.inputDateFormat).toDate();
    }
  }

  public toString(): string {
    return this.id + '/' + this.language;
  }

  public static fromObject(o: any): UserContent {

    return new UserContent(
      o.id,
      o.content,
      UserContentLanguage.fromObject(o.language),
      o.tag,
      o.modDate
    );

  }

}
