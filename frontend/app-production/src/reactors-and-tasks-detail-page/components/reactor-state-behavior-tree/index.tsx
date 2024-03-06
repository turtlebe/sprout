import React from 'react';

import { useGetState } from '../../hooks';
import { ReactorPath, ReactorStateReturnType } from '../../types';
import { ReactorBehaviorTree } from '../reactor-behavior-tree';

const dataTestIds = {};

export { dataTestIds as dataTestIdsReactorStateBehaviorTree };

export interface ReactorStateBehaviorTree {
  reactorPath?: ReactorPath;
}

export const ReactorStateBehaviorTree: React.FC<ReactorStateBehaviorTree> = ({ reactorPath }) => {
  const {
    data: reactorStateReturnValue,
    isLoading,
    reload,
  } = useGetState<ReactorStateReturnType>({
    axiosRequestConfig: reactorPath && {
      url: `/api/plentyservice/executive-service/get-reactor-state/${reactorPath}`,
    },
    errorTitle: 'Error loading reactor state',
    enablePeriodicRefresh: false,
  });

  return (
    <ReactorBehaviorTree isLoading={isLoading} reload={reload} behaviorTree={reactorStateReturnValue?.state?.trace} />
  );
};
