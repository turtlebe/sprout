import { useHistory } from 'react-router-dom';
import { useLocalStorage } from 'react-use';

import { LOCAL_STORAGE_QUERY_PARAMS_PREFIX } from '../constants';

export const useLocalStorageQueryParams = () => {
  const history = useHistory();

  return useLocalStorage<any>(`${LOCAL_STORAGE_QUERY_PARAMS_PREFIX}:${history.location.pathname}`);
};
