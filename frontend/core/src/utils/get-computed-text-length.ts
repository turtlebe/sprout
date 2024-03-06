/**
 * Allows to mock `getComputedTextLength` in test because it is not supported by Jest.
 */
export function getComputedTextLength(text: SVGTextElement) {
  return text.getComputedTextLength();
}
