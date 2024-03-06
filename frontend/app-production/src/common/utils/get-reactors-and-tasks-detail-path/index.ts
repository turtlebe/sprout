import { toQueryParams } from '@plentyag/core/src/utils/to-query-params';

export interface UseGetReactorsAndTasksDetailPath {
  reactorsAndTasksDetailBasePath: string;
  reactorPath: string;
  taskId?: string;
}

/**
 * This helper function gets the path to reactors
 * and tasks detail page. Optionally, a taskId can be
 * provided to see the details of a running task.
 */
export const getReactorsAndTasksDetailPath = ({
  reactorsAndTasksDetailBasePath,
  reactorPath,
  taskId,
}: UseGetReactorsAndTasksDetailPath): string => {
  return `${reactorsAndTasksDetailBasePath}/${reactorPath}${toQueryParams({ taskId })}`;
};
