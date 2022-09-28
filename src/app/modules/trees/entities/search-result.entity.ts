/**
 * Holds meta info on the search result T.
 * @author Laurenz Fiala
 * @since 2021/02/18
 */
export class SearchResult<T> {

  public transactionId: string;
  public metadata: [key: string, value: any];
  public result: T;

  constructor(transactionId: string, metadata: [key: string, value: any], result: T) {
    this.transactionId = transactionId;
    this.metadata = metadata;
    this.result = result;
  }

  /**
   * Note: #results must be mapped manually.
   * @param o untyped json
   */
  public static fromObject(o: any): SearchResult<any> {

    return new SearchResult<any>(
      o.transactionId,
      o.metadata,
      o.result
    );

  }

}
