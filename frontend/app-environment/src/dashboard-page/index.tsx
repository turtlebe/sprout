import {
  ButtonsSaveCancel,
  DropdownDashboardActions,
  HeaderDashboard,
} from '@plentyag/app-environment/src/common/components';
import {
  ScheduleDefinitionContextProvider,
  useDashboardApi,
  useWindowDateTime,
} from '@plentyag/app-environment/src/common/hooks';
import { AppLayout, CircularProgressCentered, Show, WindowDateTimePicker } from '@plentyag/brand-ui/src/components';
import { Box } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import { GridWidgets, NoWidgets } from './components';
import { DashboardGridContext, useWidgetsApi } from './hooks';

const dataTestIds = {
  loader: 'dashboard-page-loader',
};

export { dataTestIds as dataTestIdsDashboardPage };

export interface DashboardPageUrlParams {
  dashboardId: string;
}

export const DashboardPage: React.FC<RouteComponentProps<DashboardPageUrlParams>> = ({ match }) => {
  const { dashboardId } = match.params;
  const { dashboard, isLoading: isLoadingDashboard, revalidate: reloadDashboard } = useDashboardApi({ dashboardId });
  const { startDateTime, endDateTime, setStartDateTime, setEndDateTime } = useWindowDateTime();
  const [canDrag, setCanDrag] = React.useState<boolean>(false);
  const {
    widgets,
    isLoading: isLoadingWidgets,
    reloadWidgets,
    resetWidgets,
    overrideWidget,
    persistWidgets,
    updateWidgetsLocally,
  } = useWidgetsApi(dashboardId);

  function handleWindowChanged(startDateTime, endDateTime) {
    setStartDateTime(startDateTime);
    setEndDateTime(endDateTime);
  }

  const isLoading = isLoadingDashboard || isLoadingWidgets;

  return (
    <ScheduleDefinitionContextProvider>
      <AppLayout>
        <HeaderDashboard dashboard={dashboard} isLoading={isLoading}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <WindowDateTimePicker
              startDateTime={startDateTime}
              endDateTime={endDateTime}
              onChange={handleWindowChanged}
            />
            <Box display="flex" alignItems="center">
              {canDrag ? (
                <ButtonsSaveCancel
                  onCancel={() => {
                    setCanDrag(false);
                    resetWidgets();
                  }}
                  onSave={() => {
                    setCanDrag(false);
                    persistWidgets();
                  }}
                />
              ) : (
                <DropdownDashboardActions
                  dashboard={dashboard}
                  widgets={widgets}
                  onDashboardUpdated={() => {
                    void reloadDashboard();
                    void reloadWidgets();
                  }}
                  onClickMoveResizeWidgets={() => setCanDrag(true)}
                />
              )}
            </Box>
          </Box>
        </HeaderDashboard>

        <NoWidgets dashboardId={dashboardId} widgets={widgets} isLoading={isLoading} onWidgetCreated={reloadWidgets} />

        <Show when={!isLoading} fallback={<CircularProgressCentered data-testid={dataTestIds.loader} />}>
          <DashboardGridContext.Provider value={{ canDrag, overrideWidget, dashboard, startDateTime, endDateTime }}>
            <GridWidgets
              widgets={widgets}
              canDrag={canDrag}
              onWidgetDeleted={reloadWidgets}
              onWidgetsMovedResized={updateWidgetsLocally}
            />
          </DashboardGridContext.Provider>
        </Show>
      </AppLayout>
    </ScheduleDefinitionContextProvider>
  );
};
