
/**
 * Basic beacon information.
 * @author Laurenz Fiala
 * @since 2018/06/16
 */
export enum BeaconStatus {

  /**
   * The beacon is operational and connects & logs normally.
   */
  OK = 'OK',

  /**
   * The beacon has an unknown PIN & needs to be reset.
   */
  LOCKED = 'LOCKED',

  /**
   * The beacon has invalid settings which prevent correct
   * read-out of data or logs.
   */
  INVALID_SETTINGS = 'INVALID_SETTINGS'

}
