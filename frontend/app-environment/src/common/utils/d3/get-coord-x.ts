import * as d3 from 'd3';
import moment from 'moment';

export interface GetCoordX {
  x: d3.ScaleTime<number, number>;
  i: number;
  min: Date;
  max: Date;
}

export function getCoordX({ x, i, min, max }: GetCoordX): number {
  const invertedI = x.invert(i);
  const invertedMomentI = moment(invertedI);

  if (invertedMomentI.isAfter(moment(max))) {
    return x(max);
  }

  if (invertedMomentI.isBefore(moment(min))) {
    return x(min);
  }

  return i;
}
