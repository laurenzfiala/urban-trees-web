import {Subscription} from 'rxjs/Subscription';
import {Injectable} from '@angular/core';

/**
 * Subscription manager can be used to register pending subscriptions and destroy
 * them at another time without cluttering the service or component class.
 *
 * @author Laurenz Fiala
 * @since 2018/02/15
 */
@Injectable()
export class SubscriptionManagerService {

  /**
   * Key to use when a subscription is registered that hab no tag.
   */
  public static UNTAGGED_KEY: string = null;

  /**
   * Holds all registered subscriptions and their tag.
   * Subscriptions without a tag have a null-key.
   * @type {Map<string, Array<Subscription>>} key is the tag, value the list of subscriptions for that tag
   */
  private subscriptions: Map<string, Array<Subscription>> = new Map<string, Array<Subscription>>();

  /**
   * Register a subscription with optional tag.
   * @param {string} tag (optional) tag to destroy this subscription
   * @param {Subscription} subscription value
   */
  public register(subscription: Subscription, tag: string = SubscriptionManagerService.UNTAGGED_KEY) {

    if (this.subscriptions.has(tag)) {
      this.subscriptions.get(tag).push(subscription);
    } else {
      this.subscriptions.set(tag, [subscription]);
    }

  }

  /**
   * Unsubscribe from all subscriptions registered with specified tag.
   * If no tag is given, the default tag is used.
   */
  public unsubscribe(tag?: string) {

    if (tag === undefined) {
      tag = SubscriptionManagerService.UNTAGGED_KEY;
    }

    const subs = this.subscriptions.get(tag);
    if (!subs) {
      return;
    }

    subs.forEach((sub: Subscription) =>  {
      sub.unsubscribe();
    });

  }

}
