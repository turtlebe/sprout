import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { axiosRequest, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { getScheduleDefinitionUrl } from '../../utils';

export interface ScheduleDefinitionContext {
  scheduleDefinitions: { [path: string]: ScheduleDefinition };
  loadingStatuses: { [path: string]: boolean };
  fetchScheduleDefinition: (path: string) => void;
}

const initialContext: ScheduleDefinitionContext = {
  scheduleDefinitions: {},
  loadingStatuses: {},
  fetchScheduleDefinition: () =>
    console.warn('You need to wrap your component within <ScheduleDefinitionContextProvider />.'),
};

const ScheduleDefinitionContext = React.createContext<ScheduleDefinitionContext>(null);

export const ScheduleDefinitionContextProvider: React.FC = ({ children }) => {
  const snackbar = useGlobalSnackbar();
  const [scheduleDefinitions, setScheduleDefinitions] = React.useState<
    ScheduleDefinitionContext['scheduleDefinitions']
  >({});
  const [loadingStatuses, setLoadingStatuses] = React.useState<ScheduleDefinitionContext['loadingStatuses']>({});

  const fetchScheduleDefinition: ScheduleDefinitionContext['fetchScheduleDefinition'] = React.useCallback(
    path => {
      if (!path || scheduleDefinitions[path] || loadingStatuses[path] !== undefined) {
        return;
      }

      setLoadingStatuses(previousLoadingStatuses => ({ ...previousLoadingStatuses, [path]: true }));
      void axiosRequest<ScheduleDefinition>({ url: getScheduleDefinitionUrl(path) })
        .then(({ data }) => {
          setScheduleDefinitions(previousScheduleDefinitions => ({ ...previousScheduleDefinitions, [path]: data }));
        })
        .catch(error => {
          snackbar.errorSnackbar({ message: parseErrorMessage(error) });
        })
        .finally(() => {
          setLoadingStatuses(previousLoadingStatus => ({ ...previousLoadingStatus, [path]: false }));
        });
    },
    [scheduleDefinitions, loadingStatuses, setLoadingStatuses, setScheduleDefinitions]
  );

  return (
    <ScheduleDefinitionContext.Provider value={{ scheduleDefinitions, loadingStatuses, fetchScheduleDefinition }}>
      {children}
    </ScheduleDefinitionContext.Provider>
  );
};

export const useScheduleDefinitionContext = () => {
  const context = React.useContext(ScheduleDefinitionContext);

  return context ?? initialContext;
};
