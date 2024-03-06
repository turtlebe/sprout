/**
 * Send ProductionActionOnComplete custom event to the document root element.
 * Since DOMUIEvent (https://www.teamdev.com/downloads/jxbrowser/javadoc/com/teamdev/jxbrowser/chromium/dom/events/DOMUIEvent.html)
 * actually does not provide a method for getting custom event detail payload,
 * this payload object is written to the global JavaScript Window object instead,
 * so it can be read by client code in JxBrowser browser in Ignition.
 *
 * @param responseCode
 * @param errorMessage
 */
export const notifyProductionActionHasCompleted = (responseCode: number, errorMessage: string) => {
  window.customEventPayload = {
    productionActionOnComplete: {
      responseCode,
      errorMessage,
    },
  };
  var rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.dispatchEvent(new CustomEvent('ProductionActionOnComplete'));
  }
};
