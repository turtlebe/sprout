import * as d3 from 'd3';

import { RenderObservationsGraphFunction } from '.';

export const clear: RenderObservationsGraphFunction =
  ({ ref }) =>
  () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };
