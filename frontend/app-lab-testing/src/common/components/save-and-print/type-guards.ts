import { AxiosError } from 'axios';

export function isAxiosResponseError(error: any): error is AxiosError<LT.SaveError> {
  return !!(error.isAxiosError && error.response);
}

export function isFieldError(object: any): object is LT.FieldError {
  return typeof object === 'object';
}
