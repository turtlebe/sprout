import { isEqual, isNil, pickBy } from 'lodash';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  decodeQueryParams,
  encodeQueryParams,
  objectToSearchString,
  QueryParamConfigMap,
  searchStringToObject,
} from 'serialize-query-params';

type Parameters = Record<string, any>;

interface QueryParameterProvider<T extends Parameters> {
  defaultParameters: T;
}

interface UseQueryParameterContextValue<T extends Parameters> {
  parameters: T;
  setParameters: (parameters: Partial<T>) => void;
  resetParameters: (parameterName: (keyof T)[], push?: boolean) => string;
  resetAllParameters: () => void;
}

/**
 * This function creates a React context that can be used to manage query parameters.
 * It hides all of the details of managing query parameters and provides a simple API
 * to get and set query parameters.
 *
 * This function is generically typed so that the type T specifies the allowed
 * query parameters and provides type safety when getting or setting query parameters.
 *
 * The query parameter serialization/deserialization is performed using the lib: "serialize-query-params".
 * https://github.com/pbeshai/use-query-params/tree/master/packages/serialize-query-params#api
 * The function parameter "queryParamConfigMap" is a map of query parameter names specifying
 * the serialization/deserialization rules for each parameter.
 *
 * The React context provider accepts the prop "defaultParameters" which is a map of
 * query parameter names with the default values. These values will be used if the
 * query parameter is not present in the URL.
 */
export const createQueryParameterContext = function <T extends Parameters>(queryParamConfigMap: QueryParamConfigMap) {
  const context = React.createContext<UseQueryParameterContextValue<T>>(null);

  function QueryParameterProvider({
    defaultParameters,
    children,
  }: React.PropsWithChildren<QueryParameterProvider<T>>): React.ReactElement {
    const history = useHistory();

    /**
     * This function returns the query parameters for this provider. If
     * the query parameter is not present in the URL, it will return the
     * default values specified in "defaultParameters".
     */
    const parameters = React.useMemo(() => {
      const existingEntries = searchStringToObject(history.location.search);
      const paramsToDecode = pickBy(existingEntries, (_value, key) => queryParamConfigMap[key] !== undefined);
      const decodedQueryParams = decodeQueryParams(queryParamConfigMap, paramsToDecode);

      const result = { ...defaultParameters };
      Object.keys(decodedQueryParams).forEach(parameterName => {
        if (!isNil(decodedQueryParams[parameterName])) {
          result[parameterName as keyof T] = decodedQueryParams[parameterName];
        }
      });

      return result;
    }, [defaultParameters, history.location.search]);

    /**
     * This function sets query parameters values given by "parameters".
     * If the given parameter is the same as the default parameter, it will be removed from the URL.
     */
    const setParameters = (parameters: Partial<T>) => {
      const existingEntries = searchStringToObject(history.location.search);
      const encodedQueryParams = encodeQueryParams(queryParamConfigMap, parameters);
      const newSearch = { ...existingEntries, ...encodedQueryParams };

      // remove any query parameters that are the same as the default parameters
      const allowedKeys = Object.keys(defaultParameters);
      const encodedQueryParamsNotInDefaultParamters = pickBy(
        newSearch,
        (_value, key) => !allowedKeys.includes(key) || !isEqual(parameters[key], defaultParameters[key])
      );

      history.push({
        search: objectToSearchString(encodedQueryParamsNotInDefaultParamters),
      });
    };

    /**
     * Removes only the provided query parameters from the URL.
     * Optionally, "push" can be false, which will not actually do the
     * update but will return the new search string.
     */
    const resetParameters = (parameterNames: (keyof T)[], push = true) => {
      const existingEntries = searchStringToObject(history.location.search);
      const searchItemsToKeep = pickBy(existingEntries, (_value, key) => !parameterNames.includes(key as keyof T));
      const newSearch = objectToSearchString(searchItemsToKeep);
      if (push) {
        history.push({
          search: newSearch,
        });
      }
      return newSearch;
    };

    /**
     * This function removes all query parameters used in this react context provider.
     * Note: other query parameters will not be removed.
     */
    const resetAllParameters = () => {
      resetParameters(Object.keys(defaultParameters) as (keyof T)[]);
    };

    return (
      <context.Provider value={{ parameters, setParameters, resetParameters, resetAllParameters }}>
        {children}
      </context.Provider>
    );
  }

  const useQueryParameter = () => {
    return React.useContext(context);
  };

  return {
    QueryParameterProvider,
    useQueryParameter,
  };
};
