import { ErrorOutline } from '@material-ui/icons';
import { Show } from '@plentyag/brand-ui/src/components';
import { Box, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { Widget } from '@plentyag/core/src/types/environment';
import React from 'react';

import { ButtonCreateWidget } from '../button-create-widget';

const dataTestIds = {
  info: 'no-widgets-info',
};

export { dataTestIds as dataTestIdsNoWidgets };

export interface NoWidgets {
  isLoading?: boolean;
  dashboardId: string;
  widgets: Widget[];
  onWidgetCreated: () => void;
}

export const NoWidgets: React.FC<NoWidgets> = ({ isLoading, dashboardId, widgets = [], onWidgetCreated }) => {
  return (
    <Show when={!isLoading && widgets.length === 0}>
      <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
        <Box display="flex" marginBottom={2}>
          <ErrorOutline />
          <Box padding={0.25} />
          <Typography data-testid={dataTestIds.info}>No Widget have been associated to this Dashboard yet.</Typography>
        </Box>

        <Box display="flex" alignItems="center" justifyContent="center">
          <ButtonCreateWidget dashboardId={dashboardId} onSuccess={onWidgetCreated} />
        </Box>
      </Box>
    </Show>
  );
};
