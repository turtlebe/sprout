import { hash } from '@plentyag/app-production/src/common/utils';
import * as d3 from 'd3';

/**
 * Given an operation type (name) - generate a color across the rainbow
 * to associated with type. The hash is deterministic so it will return
 * same color each time for same string.
 * @param operationType Operation type for which we want to get a color
 */
export function getOperationColor(operationType: ProdActions.OperationTypes) {
  /* @todo: using rainbow spectrum to select color is test, when we get
  real data, we'll see how this works out. */
  return d3.interpolateRainbow(hash(operationType));
}
