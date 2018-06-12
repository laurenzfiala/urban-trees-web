/**
 * Reasons for the logout.
 * Used to show appropriate feedback to the user.
 *
 * @author Laurenz Fiala
 * @since 2018/06/10
 */
export enum LogoutReason {

  NOT_AUTHENTICATED = 'noAuth',
  FORCE_LOGOUT = 'forceLogout',
  FORCE_LOGOUT_EXPIRED = 'expiryForceLogout',
  USER_LOGOUT = 'logout'

}
