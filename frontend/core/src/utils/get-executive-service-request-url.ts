export const REQUEST_ENDPOINT = '/api/plentyservice/executive-service/request';

export function getExecutiveServiceRequestUrl(path: string) {
  if (!path) {
    return undefined;
  }

  return `${REQUEST_ENDPOINT}/${path}`;
}
