/**
 * Additional information stored for searchable properties
 * marked with @search.
 *
 * @author Laurenz Fiala
 * @since 2019/08/30
 */
export class SearchDescriptor {

  public key: string;
  public applicableSearchIds: Array<string>;
  public translationKey: string;
  public qualifier: string;

  constructor(key: string, applicableSearchIds?: Array<string>, translationKey?: string, qualifier?: string) {
    this.key = key;
    this.applicableSearchIds = applicableSearchIds;
    this.translationKey = translationKey;
    this.qualifier = qualifier;
  }

  public isApplicableForSearchId(searchId: string): boolean {
    if (!this.applicableSearchIds) {
      return true;
    }
    for (let applicableSearchId of this.applicableSearchIds) {
      if (searchId === applicableSearchId) {
        return true;
      }
    }
    return false;
  }

  public static fromObject(o: any): SearchDescriptor {
    return new SearchDescriptor(
      o.key,
      o.applicableSearchIds,
      o.translationKey,
      o.qualifier
    );
  }

}
