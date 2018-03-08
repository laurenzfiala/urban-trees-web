/**
 * Contains info about an error in the API as well as the HTTP status.
 *
 * @author Laurenz Fiala
 * @since 2018/03/03
 */
export class ApiError {

  /**
   * HTTP Error status code.
   */
  public statusCode: number;

  /**
   * Error status name.
   */
  public status: string;

  /**
   * Timestamp of the error event.
   */
  public timestamp: string;

  /**
   * Basic error description for the enduser.
   */
  public message: string;

  /**
   * Converted to an errorCode, since we don't want
   * the enum names in the response.
   * @see ClientError
   */
  public clientErrorCode: number;

  constructor(status: string, timestamp: string, message: string, clientErrorCode?: number) {
    this.status = status;
    this.timestamp = timestamp;
    this.message = message;
    if (clientErrorCode) {
      this.clientErrorCode = clientErrorCode;
    }
  }

  /**
   * Construct new from untyped object.
   * If given object is null, return null.
   */
  public static fromObject(o: any): ApiError {

    if (!o) {
      return null;
    }

    return new ApiError(
      o.status,
      o.timestamp,
      o.message,
      o.clientErrorCode
    );

  }

  public withStatusCode(statusCode: number): ApiError {
    this.statusCode = statusCode;
    return this;
  }

}
