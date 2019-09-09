import {AbstractStatusComponent} from './abstract-status.component';

/**
 * This abstract component class provides helpful functionality
 * useful to all components of the app.
 * @author Laurenz Fiala
 * @since 2018/02/17
 */
export abstract class AbstractComponent extends AbstractStatusComponent {

  /**
   * Scroll the page to the given position.
   */
  protected scrollToTop(): void {
    this.scrollTo(0, 0);
  }

  /**
   * Scroll the page to the given position.
   * @param {number} x x-coordinate in px
   * @param {number} y y-coordinate in px
   */
  protected scrollTo(x: number, y: number): void {
    window.scroll(0, 0);
  }

}
