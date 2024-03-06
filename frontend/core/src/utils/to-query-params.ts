import { snakeCase } from 'lodash';

export interface ToQueryParamsOptions {
  doNotEncodeArray?: boolean;
  encodeKeyUsingSnakeCase?: boolean;
}

export function toQueryParams(object?: any, options: ToQueryParamsOptions = {}): string {
  if (!object) {
    return '';
  }

  if (typeof object !== 'object') {
    return '';
  }

  const validKeys = Object.keys(object).filter(
    key => object[key] !== undefined && (Array.isArray(object[key]) ? object[key].length !== 0 : true)
  );

  if (validKeys.length == 0) {
    return '';
  }

  const stringQueryParams = validKeys
    .map(key => {
      const keyVal = options.encodeKeyUsingSnakeCase ? snakeCase(key) : key;
      if (Array.isArray(object[key]) && options.doNotEncodeArray) {
        return object[key].map(item => `${keyVal}[]=${encodeURIComponent(item)}`).join('&');
      }

      return `${keyVal}=${encodeURIComponent(object[key])}`;
    })
    .join('&');

  return `?${stringQueryParams}`;
}
