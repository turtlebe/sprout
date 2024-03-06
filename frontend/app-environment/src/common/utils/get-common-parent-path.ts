import { Metric, Schedule } from '@plentyag/core/src/types/environment';
import { getShortenedPath } from '@plentyag/core/src/utils';

/**
 * Given a list of schedules or metrics, this function tries to identify a common parent path between them.
 *
 * The function returns the commonParentPath as well as the remainingPaths which contains the end of the paths.
 *
 * scheduleOrMetrics[0].path is equal to commonParentPath + "/" + remainingPath[0] (unshortened)
 *
 * Notes:
 * - The `remainingPaths` is returned in the same order than `schedulesOrMetrics`.
 * - The `remainingPaths` are shortened.
 */
export function getCommonParentPath(schedulesOrMetrics: (Schedule | Metric)[] = []) {
  const paths = new Map<string, number>();

  schedulesOrMetrics.forEach(({ path }) => {
    const pathParts = path.split('/');

    pathParts
      .filter((_, index) => index % 2)
      .forEach((_, index) => {
        const parentPath = pathParts.slice(0, index * 2 + 2).join('/');

        paths.set(parentPath, paths.has(parentPath) ? paths.get(parentPath) + 1 : 1);
      });
  });

  const commonParentPaths = Array.from(paths.entries()).filter(([, count]) => count === schedulesOrMetrics.length);
  const commonParentPath = commonParentPaths.length === 0 ? null : commonParentPaths.slice(-1)[0][0];

  return {
    commonParentPath,
    remainingPaths: schedulesOrMetrics.map(item =>
      item.path === commonParentPath
        ? commonParentPath.split('/').slice(-1)[0]
        : getShortenedPath(item.path.replace(commonParentPath + '/', ''))
    ),
  };
}
