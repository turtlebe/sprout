import * as d3 from 'd3';

import { RADIUSES } from '../constants';

export function onMouseOut() {
  d3.select(this).attr('r', RADIUSES.sm);
}
