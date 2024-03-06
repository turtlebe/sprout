import { DataTestIdsGraphTooltip } from '@plentyag/app-environment/src/common/utils/constants';
import { Metric } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { RenderFunction } from '.';

export interface UpdateObservations {
  show: boolean;
  metric: Metric;
  graphTooltipSelectors: DataTestIdsGraphTooltip;
}

/**
 * Simply update the visibility of Observations.
 */
export const updateObservations: RenderFunction<UpdateObservations> =
  ({}) =>
  ({ show, metric, graphTooltipSelectors }) => {
    d3.selectAll(['', 'observations', `metric_${metric.id}`].join('.')).attr('visibility', show ? 'visible' : 'hidden');

    const element = document.querySelector<HTMLElement>(`#${graphTooltipSelectors.metricWithObservations(metric)}`);
    if (element) {
      element.style.display = show ? 'inherit' : 'none';
    }
  };
