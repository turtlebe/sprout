// @todo: When using our IconButton implementation with a tooltip, a forwardRef React error is thrown.
// eslint-disable-next-line no-restricted-imports
import { IconButton } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { DialogWidgetItems, OptionAlertRule } from '@plentyag/app-environment/src/common/components';
import { getCommonParentPath } from '@plentyag/app-environment/src/common/utils';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Button, Card, CardContent, CardHeader } from '@plentyag/brand-ui/src/material-ui/core';
import { GridWidgetItemProps } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { useDashboardGridContext, useWidgetState } from '../../hooks';
import { DropdownWidget } from '../dropdown-widget';

import { WidgetLiveGroupMetric, WidgetLiveGroupSchedule } from './components';
import { useStyles } from './styles';

const DEFAULT_ITEMS_LIMIT = 3;

const dataTestIds = getScopedDataTestIds({ editWidget: 'editWidget', expand: 'expand' }, 'widgetLiveGroup');

export { dataTestIds as dataTestIdsWidgetLiveGroup };
export interface WidgetLiveGroup extends GridWidgetItemProps {}

export const WidgetLiveGroup: React.FC<WidgetLiveGroup> = ({ widget: widgetProp, onDeleted }) => {
  const classes = useStyles({});
  const { canDrag } = useDashboardGridContext();
  const { widget, open, setOpen, handleWidgetUpdated } = useWidgetState({ widget: widgetProp });
  const { remainingPaths } = getCommonParentPath(widget.items.map(item => item.metric || item.schedule));
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const items = expanded ? widget.items : widget.items.slice(0, DEFAULT_ITEMS_LIMIT);

  return (
    <Card>
      <CardHeader
        title={widget.name}
        action={<DropdownWidget widget={widget} onWidgetDeleted={onDeleted} onEditWidget={() => setOpen(true)} />}
        classes={{ root: classes.cardHeaderRoot, title: classes.cardHeaderTitle }}
      />
      <CardContent classes={{ root: classes.cardContentRoot }}>
        {widget.items.length === 0 ? (
          <Box display="flex" justifyContent="center">
            <Button onClick={() => setOpen(true)} data-testid={dataTestIds.editWidget} disabled={canDrag}>
              Edit Widget's Content
            </Button>
          </Box>
        ) : (
          items.map((item, index) =>
            item.itemType === 'METRIC' ? (
              <WidgetLiveGroupMetric key={item.id} metric={item.metric} options={item.options} />
            ) : (
              <WidgetLiveGroupSchedule
                key={item.id}
                schedule={item.schedule}
                options={item.options}
                remainingPath={remainingPaths[index]}
              />
            )
          )
        )}
        <Show when={widget.items.length > DEFAULT_ITEMS_LIMIT} fallback={<Box paddingBottom={1} />}>
          <Box display="flex" width="100%" justifyContent="center">
            <IconButton
              onClick={() => setExpanded(!expanded)}
              aria-label="expand"
              aria-expanded={expanded}
              data-testid={dataTestIds.expand}
              className={classes.expandIconButton}
            >
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          </Box>
        </Show>
      </CardContent>
      <DialogWidgetItems
        widget={widget}
        open={open}
        onClose={() => setOpen(false)}
        onWidgetUpdated={handleWidgetUpdated}
        renderAlertRule={alertRule => <OptionAlertRule alertRule={alertRule} />}
        multiple
        chooseActionDefinitionKey
      />
    </Card>
  );
};
