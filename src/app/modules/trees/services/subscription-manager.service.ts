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
   * Return a new unique tag that has not yet
   * been registered. The tag will always start
   * with the given prefix.
   * Enter all following non-global
   * subscriptions using the returned tag.
   * @param prefix The generated tags prefix.
   */
  public tag(prefix: string): string {

    let tag = prefix;
    let i = 0;
    while (this.subscriptions.has(tag)) {
      tag = prefix + i;
      i++;
    }
    this.subscriptions.set(tag, []);
    return tag;

  }

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

  public reg(subscription: Subscription, tag: string = SubscriptionManagerService.UNTAGGED_KEY) {
    this.register(subscription, tag);
  }

  /**
   * Register a subscription with a tag.
   * If the given tag is already registered, all registered
   * subscriptions for that tag are unsubscribed from.
   * @param {string} tag tag to destroy this subscription
   * @param {Subscription} subscription value
   */
  public registerSingleton(subscription: Subscription, tag: string) {
    this.unsubscribe(tag);
    this.register(subscription, tag);
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

  /**
   * Unsubscribe from all registered subscriptions.
   */
  public unsubAll(): void {

    this.subscriptions.forEach(subArray => {
      subArray.forEach(sub => sub.unsubscribe());
    });

  }

}
