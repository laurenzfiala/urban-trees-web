import {User} from './user.entity';

/**
 * Holds a template user and all usernames to register
 * using the given template.
 *
 * @author Laurenz Fiala
 * @since 2021/02/16
 */
export class UserCreation {

  /**
   * Template off which to base each new
   * user given in #usernames.
   */
  public template: User;

  /**
   * Users to create. For each
   * array element, one user is created.
   */
  public usernames: Array<string>;

  constructor(template: User,
              usernames: Array<string>) {
    this.template = template;
    this.usernames = usernames;
  }

}
