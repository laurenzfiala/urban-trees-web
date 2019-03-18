import * as moment from 'moment/moment';
import {Role} from './role.entity';
import {environment} from '../../environments/environment';

/**
 * Language of custom user content.
 *
 * @author Laurenz Fiala
 * @since 2019/03/15
 */
export class UserContentLanguage {

  public id: string;
  public name: string;

  constructor(id?: string,
              name?: string) {
    this.id = id;
    this.name = name;
  }

  public static fromObject(o: any): UserContentLanguage {

    return new UserContentLanguage(
      o.id,
      o.name
    );

  }

}
