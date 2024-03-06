import { UseAxiosReturn, usePostRequest } from '@plentyag/core/src/hooks';

export const UNPAGINATE_URL = '/api/plentyservice/unpaginate';
export const UNPAGINATE_SWAGGER_URL = '/api/swagger/unpaginate';
export const UNPAGINATE_DEFAULT_LIMIT = 1000;

export interface UseUnpaginate {
  serviceName: string;
  apiName?: string;
  operation: string;
}

export interface UseUnpaginateReturn<Response, Request>
  extends Pick<UseAxiosReturn<Response, Request>, 'data' | 'isLoading' | 'makeRequest' | 'error'> {}

/**
 * This is the actual type of the Request sent to the server.
 */
interface UnpaginateRequest<Request> {
  serviceName: string;
  apiName?: string;
  operation: string;
  bodyRequest: { limit: number } & Request;
}

/**
 * Hook that leverages the plentyservice/unpaginate endpoint to delegate unpagination in one request to the server.
 */
export const useUnpaginate = <Response, Request = any>({
  serviceName,
  apiName,
  operation,
}: UseUnpaginate): UseUnpaginateReturn<Response, Request> => {
  const {
    data,
    error,
    isLoading,
    makeRequest: axiosMakeRequest,
  } = usePostRequest<Response, UnpaginateRequest<Request>>({
    url: apiName ? UNPAGINATE_SWAGGER_URL : UNPAGINATE_URL,
  });

  const makeRequest: UseAxiosReturn<Response, Request>['makeRequest'] = params => {
    const data: UnpaginateRequest<Request> = {
      serviceName,
      apiName,
      operation,
      bodyRequest: { limit: UNPAGINATE_DEFAULT_LIMIT, ...params.data },
    };

    axiosMakeRequest({ ...params, data });
  };

  return {
    data,
    error,
    isLoading,
    makeRequest,
  };
};
