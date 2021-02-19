/**
 * Holds meta info on the search result T.
 * @author Laurenz Fiala
 * @since 2021/02/18
 */

export class SearchResult<T> {

  public metadata: [key: string, value: any];
  public result: T;

  constructor(metadata: [key: string, value: any], result: T) {
    this.metadata = metadata;
    this.result = result;
  }

  /**
   * Note: #results must be mapped manually.
   * @param o untyped json
   */
  public static fromObject(o: any): SearchResult<any> {

    return new SearchResult<any>(
      o.metadata,
      o.result
    );

  }

}
