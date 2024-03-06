import { DialogWidgetItems } from '@plentyag/app-environment/src/common/components';
import { useConverter, useUnitConversion } from '@plentyag/app-environment/src/common/hooks';
import { isNumericalMetric } from '@plentyag/app-environment/src/common/utils';
import {
  DashboardGraphMetricNonNumerical,
  DashboardGraphMetrics,
  DashboardGraphSchedules,
} from '@plentyag/app-environment/src/dashboard-page/components';
import { CircularProgressCentered } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CardContent, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { GridWidgetItemProps, TooltipPositioning } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useDashboardGridContext, useWidgetState } from '../../hooks';
import { DropdownWidget } from '../dropdown-widget';

const dataTestIds = getScopedDataTestIds({ editWidget: 'editWidget', loader: 'loader' }, 'widgetHistorical');

export { dataTestIds as dataTestIdsWidgetHistorical };

export interface WidgetHistorical extends GridWidgetItemProps {}

export const WidgetHistorical: React.FC<WidgetHistorical> = ({ widget: widgetProp, onDeleted }) => {
  const { dashboard, startDateTime, endDateTime, canDrag } = useDashboardGridContext();
  const { widget, open, setOpen, handleWidgetUpdated } = useWidgetState({ widget: widgetProp });

  const rawMetrics = React.useMemo(
    () =>
      widget.items
        .filter(item => item.itemType === 'METRIC' && isNumericalMetric(item.metric))
        .map(item => item.metric),
    [widget]
  );
  const rawSchedules = React.useMemo(
    () => widget.items.filter(item => item.itemType === 'SCHEDULE').map(item => item.schedule),
    [widget]
  );

  const { getConcreteMeasurementType } = useUnitConversion();
  const { metrics, schedules, scheduleDefinitions, isLoading } = useConverter({
    metrics: rawMetrics,
    schedules: rawSchedules,
  });

  return (
    <>
      {!widget.items.length && (
        <Card>
          <CardHeader
            title={widget.name}
            action={<DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)} />}
          />
          <CardContent>
            <Box display="flex" justifyContent="center">
              <Button onClick={() => setOpen(true)} data-testid={dataTestIds.editWidget} disabled={canDrag}>
                Edit Widget's Content
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      {/* Loading State when the converter is fetching ScheduleDefinitions */}
      {isLoading && (
        <Card>
          <CardHeader title={widget.name} />
          <CardContent>
            <CircularProgressCentered size="1rem" data-testid={dataTestIds.loader} />
          </CardContent>
        </Card>
      )}
      {/* Widget contains Schedules */}
      {schedules?.length > 0 && scheduleDefinitions?.length === schedules?.length && (
        <DashboardGraphSchedules
          schedules={schedules}
          scheduleDefinitions={scheduleDefinitions}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          title={widget.name}
          action={<DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)} />}
          tooltipPositioning={TooltipPositioning.grid}
        />
      )}
      {/* Widget contains Numerical Metrics */}
      {metrics?.length > 0 && (
        <DashboardGraphMetrics
          dashboard={dashboard}
          measurementType={getConcreteMeasurementType(metrics[0].measurementType)}
          metrics={metrics}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          title={widget.name}
          action={<DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)} />}
          tooltipPositioning={TooltipPositioning.grid}
        />
      )}
      {/* Widget contains a single Non-Numerical Metric */}
      {widget.items.length === 1 &&
        widget.items[0].itemType === 'METRIC' &&
        !isNumericalMetric(widget.items[0].metric) && (
          <DashboardGraphMetricNonNumerical
            metric={widget.items[0].metric}
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            title={widget.name}
            action={<DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)} />}
            tooltipPositioning={TooltipPositioning.grid}
          />
        )}
      <DialogWidgetItems
        widget={widget}
        open={open}
        onClose={() => setOpen(false)}
        onWidgetUpdated={handleWidgetUpdated}
        nonNumericalMetricLimit={1}
        scheduleOrAlertRuleOnly
        multiple
      />
    </>
  );
};
