import * as d3 from 'd3';

import { UseGraphApi } from '.';

export const clear =
  ({ ref }: UseGraphApi) =>
  () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };
