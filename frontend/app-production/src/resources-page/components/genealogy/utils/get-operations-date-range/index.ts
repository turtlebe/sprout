/**
 * For given array of operations return oldest and newest operation dates.
 * @param operations aray of operations performed on a resource.
 * @return Object contain 'start' --> "oldest date", and
 * 'end' --> "newest date" in given operations.
 */
export const getOperationsDateRange = (operations: ProdResources.Operation[]) => {
  const dates: Date[] = [];

  if (operations.length === 0) {
    throw new Error('Number of operations must be greater than zero.');
  }

  operations.forEach(op => {
    dates.push(new Date(op.endDt));
  });

  const sortedDates = dates.sort((a, b) => a.getTime() - b.getTime());

  return { start: sortedDates[0], end: sortedDates[sortedDates.length - 1] };
};
