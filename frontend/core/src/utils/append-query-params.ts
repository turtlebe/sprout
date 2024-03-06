import { toQueryParams, ToQueryParamsOptions } from './to-query-params';

interface URLSearchParamsExtended extends URLSearchParams {
  /**
   * Typescript is missing this method for URLSearchParams because it's unofficial
   * feature in W3C. However, according to this article all major browsers support it
   * https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/entries
   */
  entries?: () => Iterator<any>;
}

export function appendQueryParams(object?: any, options: ToQueryParamsOptions = {}): string {
  const existingEntries = (new URLSearchParams(window.location.search) as URLSearchParamsExtended).entries();
  const existingObject = Object.fromEntries(existingEntries as any);

  const appendObject = typeof object === 'object' ? object : {};

  return toQueryParams(
    {
      ...existingObject,
      ...appendObject,
    },
    options
  );
}
