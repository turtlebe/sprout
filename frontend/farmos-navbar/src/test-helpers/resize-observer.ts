/**
 * This is a helper stub to mock up the API of ResizeObserver
 *
 * Note in this version it is only supporting ONE element unlike
 * the original that supports multiple elements to observe
 */

interface ResizeObserverEntry {
  target: {
    clientWidth?: number;
    scrollWidth?: number;
  };
}

export class MockResizeObserver {
  /**
   * Mimicking the actual constructure that receives an inputed
   * "callback" handler
   * @param callback
   */
  public constructor(callback: (arr: ResizeObserverEntry[]) => void) {
    this._callback = callback;
  }

  private readonly _callback: (arr: ResizeObserverEntry[]) => void;
  private _observedElement: HTMLElement | undefined;

  /**
   * Mimicking the "observe" api of ResizeObserver
   * - saves the observed element
   * - auto fires the handler on init
   * @param observedElement
   */
  public observe(observedElement: HTMLElement) {
    this._observedElement = observedElement;
    this._mockTriggerChange(); // Auto fire handler
  }

  /**
   * Mimicking the "unobserve" api of ResizeObserver
   * - nullifies the observed element
   * @param observedElement
   */
  public unobserve() {
    this._observedElement = undefined;
  }

  /**
   * Mimicking the "disconnect" api of ResizeObserver
   * - relays to unobserve
   * @param observedElement
   */
  public disconnect() {
    this.unobserve();
  }

  /**
   * This does not exist in the normal class, but a helper
   * to mimick a trigger change in size for tests to fire.
   *
   * What it does is grabs the current clientWidth from the element
   * then triggers the callback handler
   */
  public _mockTriggerChange() {
    if (this._observedElement) {
      const entry: ResizeObserverEntry = {
        target: {
          clientWidth: this._observedElement.clientWidth,
          scrollWidth: this._observedElement.scrollWidth,
        },
      };
      this._callback([entry]);
    }
  }
}
