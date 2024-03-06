import * as d3 from 'd3';

import { RenderFunction } from '.';

export const clear: RenderFunction<{}> =
  ({ ref }) =>
  () => {
    if (!ref.current) {
      return;
    }

    d3.select(ref.current).selectAll('svg > *').remove();
  };
