/**
 * Reasons for accessing the login/logout page.
 * Used to show appropriate feedback to the user.
 *
 * @author Laurenz Fiala
 * @since 2018/06/10
 */
export enum LoginAccessReason {

  NOT_AUTHENTICATED = 'noAuth',
  FORCE_LOGOUT = 'forceLogout',
  FORCE_LOGOUT_EXPIRED = 'expiryForceLogout',
  FORCE_LOGOUT_EXPIRED_LOGIN_LINK = 'expiryForceLogoutLoginLink',
  USER_LOGOUT = 'logout',
  INSUFFICIENT_PERMISSIONS = 'permission',
  FORCE_CREDENTIALS_CONFIRM = 'forceCredentialsConfirm'

}
