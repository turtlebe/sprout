import { Dashboard, Widget } from '@plentyag/core/src/types/environment';
import React from 'react';

export interface DashboardGridContext {
  canDrag: boolean;
  dashboard: Dashboard;
  startDateTime: Date;
  endDateTime: Date;
  overrideWidget?: (widget: Widget) => void;
}

export const DashboardGridContext = React.createContext<DashboardGridContext>(null);

export const useDashboardGridContext = () => React.useContext(DashboardGridContext);
