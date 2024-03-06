import * as d3 from 'd3';

import { UseMetricGraphApi } from '.';

export const clear =
  ({ ref }: UseMetricGraphApi) =>
  () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };
