import { Launch } from '@material-ui/icons';
import { DialogWidgetItems, LiveMetric } from '@plentyag/app-environment/src/common/components';
import { PATHS } from '@plentyag/app-environment/src/paths';
import { DropdownItem, DropdownItemIcon, DropdownItemText } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CardContent, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { GridWidgetItemProps } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import moment from 'moment';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { useDashboardGridContext, useWidgetState } from '../../hooks';
import { DropdownWidget } from '../dropdown-widget';

const dataTestIds = getScopedDataTestIds({ editWidget: 'editWidget' }, 'widgetLiveMetric');

export { dataTestIds as dataTestIdsWidgetLiveMetric };

export interface WidgetLiveMetric extends GridWidgetItemProps {}

/**
 * Widget that shows the current status of a given Metric and its associated Alert Rules.
 *
 * This type of Widget should only be associated to one WidgetItem
 * referencing a Metric. This component allows the user to delete the widget and choose
 * which Metric is associated with it. Once a Metric is choosen, the content is delegated to <LiveMetric />.
 */
export const WidgetLiveMetric: React.FC<WidgetLiveMetric> = ({ widget: widgetProp, onDeleted }) => {
  const startDateTime = React.useMemo(() => moment().subtract(2, 'hours').toDate(), []);
  const endDateTime = React.useMemo(() => moment().toDate(), []);
  const { widget, open, setOpen, handleWidgetUpdated } = useWidgetState({ widget: widgetProp });
  const { canDrag } = useDashboardGridContext();

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
              <Button onClick={() => setOpen(true)} disabled={canDrag} data-testid={dataTestIds.editWidget}>
                Edit Widget's Content
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      {widget.items.length === 1 && (
        <LiveMetric
          inGrid
          metric={widget.items[0].metric}
          startDateTime={startDateTime}
          endDateTime={endDateTime}
          action={
            <DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)}>
              <DropdownItem component={NavLink} to={PATHS.metricPage(widget.items[0].metric.id)}>
                <DropdownItemIcon>
                  <Launch />
                </DropdownItemIcon>
                <DropdownItemText>See Metric</DropdownItemText>
              </DropdownItem>
            </DropdownWidget>
          }
        />
      )}
      <DialogWidgetItems
        widget={widget}
        open={open}
        onClose={() => setOpen(false)}
        onWidgetUpdated={handleWidgetUpdated}
        metricLimit={1}
        alertRuleOnly
      />
    </>
  );
};
