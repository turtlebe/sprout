import * as d3 from 'd3';

import { RADIUSES } from '../constants';

export function onMouseOver() {
  d3.select(this).attr('r', RADIUSES.lg);
}
