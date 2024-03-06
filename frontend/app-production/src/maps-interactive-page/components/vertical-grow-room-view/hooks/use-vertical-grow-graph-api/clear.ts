import * as d3 from 'd3';

export const clear =
  ({ ref }: any) =>
  () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };
