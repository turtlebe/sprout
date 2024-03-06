import { useLocation } from 'react-router-dom';

export interface UseQueryParamReturn extends URLSearchParams {}

/**
 * A custom hook that builds on useLocation to parse
 * the query string for you.
 * @example @see https://reacttraining.com/react-router/web/example/query-parameters
 * @return @see useQueryParam
 */
export const useQueryParam = (): UseQueryParamReturn => new URLSearchParams(useLocation().search);
