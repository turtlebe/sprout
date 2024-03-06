import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useSwrAxios, UseSwrAxiosReturn } from '@plentyag/core/src/hooks';
import { PaginatedList } from '@plentyag/core/src/types';
import { Widget } from '@plentyag/core/src/types/environment';
import { axiosRequest, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

export interface UseWidgetsApiReturn {
  /**
   * The current widgets state
   */
  widgets: Widget[];

  /**
   * Whether some data is being fetched from the backend.
   */
  isLoading: boolean;

  /**
   * Reload widgets from the backend.
   */

  reloadWidgets: UseSwrAxiosReturn<PaginatedList<Widget>>['revalidate'];

  /**
   * Update the widgets state locally without persisting it to the backend.
   */
  updateWidgetsLocally: (widgets: Widget[]) => void;

  /**
   * Save the current state of the widgets to the backend.
   */
  persistWidgets: () => void;

  /**
   * Override the current state of the widget as well as the previous state of the widget. This is used when some data fetching has been
   * done elsewhere and we need to update the current state here.
   */
  overrideWidget: (widget: Widget) => void;

  /**
   * Reset the current widgets state to the previous state fetched from the backend.
   */
  resetWidgets: () => void;
}

export const useWidgetsApi = (dashboardId: string): UseWidgetsApiReturn => {
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false);
  const [widgets, setWidgets] = React.useState<Widget[]>([]);
  const [initialWidgets, setInitialWidgets] = React.useState<Widget[]>([]);
  const snackbar = useGlobalSnackbar();
  const {
    data: paginatedWidgets,
    isValidating,
    revalidate: reloadWidgets,
  } = useSwrAxios<PaginatedList<Widget>>({
    url: EVS_URLS.widgets.searchUrl(),
    method: 'POST',
    data: { dashboardId },
  });

  const updateWidgetsLocally: UseWidgetsApiReturn['updateWidgetsLocally'] = widgets => {
    setWidgets(widgets);
  };

  const overrideWidget: UseWidgetsApiReturn['overrideWidget'] = updatedWidget => {
    const _setWidgets = previousWidgets =>
      previousWidgets.map(widget => {
        if (widget.id === updatedWidget.id) {
          return updatedWidget;
        } else {
          return widget;
        }
      });

    setWidgets(_setWidgets);
    setInitialWidgets(_setWidgets);
  };

  const persistWidgets: UseWidgetsApiReturn['persistWidgets'] = () => {
    setIsUpdating(true);
    Promise.all(
      widgets.map(async widget =>
        axiosRequest<Widget>({ url: EVS_URLS.widgets.updateUrl(widget), method: 'PUT', data: widget })
      )
    )
      .then(response => {
        snackbar.successSnackbar('Widget(s) successfully updated.');
        const updatedWidgets = response.map(response => response.data);
        setWidgets(updatedWidgets);
        setInitialWidgets(updatedWidgets);
      })
      .catch(response =>
        snackbar.errorSnackbar({
          title: "Something went wrong when updating the Dashboard's Widgets.",
          message: parseErrorMessage(response),
        })
      )
      .finally(() => setIsUpdating(false));
  };

  const resetWidgets: UseWidgetsApiReturn['resetWidgets'] = () => {
    setWidgets(initialWidgets);
  };

  React.useEffect(() => {
    setWidgets(paginatedWidgets?.data);
    setInitialWidgets(paginatedWidgets?.data);
  }, [paginatedWidgets?.data]);

  return {
    isLoading: isValidating || isUpdating,
    widgets,
    reloadWidgets,
    updateWidgetsLocally,
    persistWidgets,
    overrideWidget,
    resetWidgets,
  };
};
