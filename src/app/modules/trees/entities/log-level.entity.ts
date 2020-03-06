/**
 * Logging levels.
 */
export enum LogLevel {

  /**
   * Only shown in dev environments for debugging purposes.
   */
  TRACE,

  /**
   * Usually only shown in dev environments and marks
   * useful information which should be highlighted.
   */
  DEBUG,

  /**
   * Something that needs to be logged in all environments, but
   * does not hamper the functionality of the app.
   */
  INFO,

  /**
   * When a serious exception occurs which hurts the
   * normal operation of the current subcomponent of the app.
   * The app can recover from an exception with this severity,
   * but only with additional user interaction.
   */
  WARN,

  /**
   * When a critical exception occurs which is fatal
   * for the further execution of the app.
   */
  ERROR

}
