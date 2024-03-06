import { useObservationsScale, useRenderObservationsGraphApi } from '@plentyag/app-environment/src/common/hooks';
import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric, TimeSummarization } from '@plentyag/core/src/types/environment';
import React from 'react';

const dataTestIds = {};

export { dataTestIds as dataTestIdsLiveObservationsGraph };

export interface LiveObservationsGraph {
  metric: Metric;
  startDateTime: Date;
  endDateTime: Date;
  data: RolledUpByTimeObservation[];
  timeSummarization: TimeSummarization.mean;
  unitSymbol: string;
  color: string;
}

export const LiveObservationsGraph: React.FC<LiveObservationsGraph> = ({
  metric,
  startDateTime,
  endDateTime,
  data = [],
  timeSummarization,
  unitSymbol,
  color,
}) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const values = data.map(d => d[timeSummarization]);
  const scale = useObservationsScale({
    minY: Math.min(...values),
    maxY: Math.max(...values),
    startDateTime,
    endDateTime,
  });
  const chartApi = useRenderObservationsGraphApi({ ref, scale });

  React.useEffect(() => {
    if (data.length > 0) {
      chartApi.clear();
      chartApi.renderObservations({
        observations: data,
        metric,
        unitSymbol,
        color,
        timeSummarization,
      });
    }
  }, [data]);

  if (!isNumericalMetric(metric)) {
    return null;
  }

  return (
    <Box style={{ width: scale.width, height: scale.height }}>
      <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
    </Box>
  );
};
