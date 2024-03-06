import { DialogWidgetItems } from '@plentyag/app-environment/src/common/components';
import { Widget } from '@plentyag/core/src/types/environment';
import { isEqual } from 'lodash';
import React from 'react';

import { useDashboardGridContext } from '../use-dashboard-grid-context';

export interface UseWidgetState {
  widget: Widget;
}
export interface UseWidgetStateReturn {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  widget: Widget;
  handleWidgetUpdated: DialogWidgetItems['onWidgetUpdated'];
}

export const useWidgetState = ({ widget: widgetProp }: UseWidgetState): UseWidgetStateReturn => {
  const { overrideWidget } = useDashboardGridContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const [widget, setWidget] = React.useState(widgetProp);

  const handleWidgetUpdated: DialogWidgetItems['onWidgetUpdated'] = updatedWidget => {
    setOpen(false);
    setWidget(updatedWidget);
    overrideWidget(updatedWidget);
  };

  React.useEffect(() => {
    if (!isEqual(widget, widgetProp)) {
      setWidget(widgetProp);
    }
  }, [widgetProp]); // only react when widgetProp changes.

  return {
    open,
    setOpen,
    widget,
    handleWidgetUpdated,
  };
};
