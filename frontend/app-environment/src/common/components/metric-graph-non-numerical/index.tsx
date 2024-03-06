import {
  DownloadData,
  getGraphTooltipDataTestIds,
  getGraphTooltipNonNumericalDataTestIds,
  GraphSettingsNonNumerical,
  GraphTooltip,
} from '@plentyag/app-environment/src/common/components';
import { useMetricGraphApi, useMetricScale, useOptimalYAxis } from '@plentyag/app-environment/src/common/hooks';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Card, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { useMeasure } from '@plentyag/core/src/hooks';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import {
  DataInterpolation,
  DataInterpolationType,
  Metric,
  ObservationsByTime,
  TimeGranularity,
  TimeSummarization,
  TooltipPositioning,
} from '@plentyag/core/src/types/environment';
import { uuidv4 } from '@plentyag/core/src/utils/uuidv4';
import React from 'react';

import { GraphTooltipNonNumerical } from '../graph-tooltip-non-numerical';

import { DetailsDrawer, GraphLegendNonNumerical } from './components';
import { useStyles } from './styles';

const dataTestIds = {
  header: 'metric-graph-non-numerical-header',
};

export { dataTestIds as dataTestIdsMetricGraphNonNumerical };

export interface MetricGraphNonNumerical {
  startDateTime: Date;
  endDateTime: Date;
  metric: Metric;
  observations: RolledUpByTimeObservation[];
  isEditing: boolean;
  isLoading: boolean;
  height?: number;
  title?: React.ReactNode;
  action?: React.ReactNode;
  timeGranularity: TimeGranularity;
  previousTimeGranularity: TimeGranularity;
  valueAttribute?: string;
  dataInterpolation: DataInterpolation;
  previousValueAttribute?: string;
  onTimeGranularityChange: GraphSettingsNonNumerical['onTimeGranularityChange'];
  onValueAttributeChange?: GraphSettingsNonNumerical['onValueAttributeChange'];
  onDataInterpolationChange?: GraphSettingsNonNumerical['onDataInterpolationChange'];
  paddingBottom?: number;
  tooltipPositioning?: TooltipPositioning;
}

/**
 * Graph to render data related to a Non-Numerical Metric.
 *
 * This is essentially an histogram of the Observations. This graph is always read only.
 */
export const MetricGraphNonNumerical: React.FC<MetricGraphNonNumerical> = ({
  startDateTime,
  endDateTime,
  metric,
  observations,
  isEditing,
  isLoading,
  height,
  title,
  action,
  timeGranularity,
  previousTimeGranularity,
  valueAttribute,
  dataInterpolation,
  previousValueAttribute,
  onTimeGranularityChange = () => {},
  onValueAttributeChange = () => {},
  onDataInterpolationChange = () => {},
  children,
  paddingBottom,
  tooltipPositioning,
}) => {
  const classes = useStyles({});
  const [graphTooltipSelectors] = React.useState(getGraphTooltipDataTestIds(`graph-tooltip-${uuidv4()}`));
  const [graphTooltipSelectorsNonNumerical] = React.useState(
    getGraphTooltipNonNumericalDataTestIds(`graph-tooltip-nn-${uuidv4()}`)
  );

  const timeSummarization = TimeSummarization.value;
  const { min, max } = useOptimalYAxis({
    metrics: [metric],
    observationStreams: [observations],
    timeSummarization,
    buffer: 0,
  });
  const ref = React.useRef<SVGSVGElement>(null);
  const refSize = useMeasure(ref);
  const scale = useMetricScale({
    isStepInterpolation: dataInterpolation.value === DataInterpolationType.step,
    observations,
    minY: min,
    maxY: max,
    width: refSize.width,
    height,
    startDateTime,
    endDateTime,
  });

  const chartApi = useMetricGraphApi({ ref, scale });
  const [observationsByTime, setObservationsByTime] = React.useState<ObservationsByTime>();

  React.useEffect(() => {
    chartApi.clear();
    chartApi.renderGraph({ unitSymbol: '', isEditing });

    // fork here on the rendering
    if (dataInterpolation.value == DataInterpolationType.step) {
      // new function to render the  with step interpolation
      chartApi.renderNonNumericalObservationsStepInterpolation({
        metric,
        observations,
      });
      chartApi.renderMouseOverEffect({
        observations,
        unitSymbol: '',
        graphTooltipSelectors,
        timeSummarization,
        tooltipPositioning,
      });
    } else {
      chartApi.renderNonNumericalObservations({
        observations,
        graphTooltipSelectors: graphTooltipSelectorsNonNumerical,
        timeGranularity: previousTimeGranularity,
        valueAttribute: previousValueAttribute,
        onClick: setObservationsByTime,
        tooltipPositioning,
      });
    }
    chartApi.renderTodaysLine({ isEditing });
  }, [
    scale.minY,
    scale.maxY,
    scale.width,
    startDateTime,
    endDateTime,
    observations,
    isEditing,
    previousTimeGranularity,
    previousValueAttribute,
    dataInterpolation,
  ]);

  return (
    <Card>
      <Box position="relative">
        <Show when={Boolean(title)}>
          <CardHeader
            title={title}
            data-testid={dataTestIds.header}
            action={action}
            classes={{ title: classes.title }}
          />
        </Show>
        <Box paddingX={2} paddingBottom={paddingBottom}>
          <GraphSettingsNonNumerical
            isLoading={isLoading}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            valueAttribute={valueAttribute}
            dataInterpolation={dataInterpolation}
            onTimeGranularityChange={onTimeGranularityChange}
            onValueAttributeChange={onValueAttributeChange}
            onDataInterpolationChange={onDataInterpolationChange}
            right={action ? '3rem' : undefined}
            downloadIcon={
              <DownloadData
                metrics={[metric]}
                observations={[observations]}
                disabled={isLoading}
                startDateTime={startDateTime}
                endDateTime={endDateTime}
              />
            }
          />

          <Box flex="1 1 0" display="flex" justifyContent="center" flexDirection="column" overflow="hidden">
            <svg ref={ref} viewBox={`0 0 ${scale.width} ${scale.height}`} />
          </Box>

          <GraphLegendNonNumerical observations={observations} dataInterpolation={dataInterpolation} />
        </Box>
        {children}
      </Box>
      {/* For Data Visualization: Default */}
      <GraphTooltipNonNumerical data-testid={graphTooltipSelectorsNonNumerical.root} />
      {/* For Data Visualization: Step */}
      <GraphTooltip observations={observations} data-testid={graphTooltipSelectors.root} />
      <Show when={dataInterpolation.value === DataInterpolationType.default}>
        <DetailsDrawer
          metric={metric}
          observationsByTime={observationsByTime}
          timeGranularity={previousTimeGranularity}
          valueAttribute={previousValueAttribute}
          onClose={() => setObservationsByTime(null)}
        />
      </Show>
    </Card>
  );
};
