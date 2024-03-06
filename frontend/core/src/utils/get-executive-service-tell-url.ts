export const TELL_ENDPOINT = '/api/plentyservice/executive-service/tell';

export function getExecutiveServiceTellUrl(path: string) {
  if (!path) {
    return undefined;
  }

  return `${TELL_ENDPOINT}/${path}`;
}
