import { getOperationsDateRange } from '../../utils';

/**
 * determine x and y axis sizing...
 * size x based on old and new dates.
 * size y based on number of lines drawn vertically.
 *
 * ex: 1 antecedent, 1 focused line and two subsequents -->
 * ---A1---        -----S1-----
 *       ----F----
 *             -------S2----
 *
 * x-axis: oldest date on A1 (antecedent) to newest date on S1 (subsequent)
 * y-axis: number of lines in y direction is 3
 *
 * @param focusedResource Genealogy data.
 *
 * @return Start and end date range for the x axis and start and end index
 * for the y axis. Y height is the maximum of lines drawn vertically.
 */
export function getChartRange(focusedResource: ProdResources.FocusedResource) {
  let numAntecedents = 0;
  let numSubsequents = 0;

  let operations: ProdResources.Operation[] = focusedResource.operations;
  focusedResource.operations.forEach(op => {
    numAntecedents += op.antecedents.length;
    numSubsequents += op.subsequents.length;

    op.antecedents.forEach(antecedent => {
      if (antecedent.operations.length > 0) {
        operations = operations.concat(antecedent.operations);
      }
    });

    op.subsequents.forEach(subsequent => {
      if (subsequent.operations.length > 0) {
        operations = operations.concat(subsequent.operations);
      }
    });
  });

  numSubsequents = focusedResource.parent ? numSubsequents - 1 : numSubsequents;

  const { start: startDate, end: endDate } = getOperationsDateRange(operations);
  // show 10% extra of total date range on left and right of timeline.
  const dateMargin = 0.1 * (endDate.getTime() - startDate.getTime());
  startDate.setTime(startDate.getTime() - dateMargin);
  endDate.setTime(endDate.getTime() + dateMargin);

  const startIndex = 0;
  const endIndex = Math.max(numAntecedents, numSubsequents, 10);

  return {
    x: { startDate, endDate },
    y: { startIndex, endIndex },
  };
}
