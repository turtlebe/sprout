export function replaceRouteUrlParams(string: string, params: object) {
  if (!params) {
    return string;
  }

  let computedString = string;
  Object.keys(params).forEach(key => {
    computedString = computedString.replace(new RegExp(`:${key}`, 'g'), params[key]);
  });

  return computedString;
}
