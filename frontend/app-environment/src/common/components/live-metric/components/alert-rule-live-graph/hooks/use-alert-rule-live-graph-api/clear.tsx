import * as d3 from 'd3';

import { RenderAlertRuleLiveGraphFunction } from '.';

export const clear: RenderAlertRuleLiveGraphFunction =
  ({ ref }) =>
  () => {
    d3.select(ref.current).selectAll('svg > *').remove();
  };
