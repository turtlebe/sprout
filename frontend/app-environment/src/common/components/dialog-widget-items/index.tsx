import { Check, Close, ErrorOutline } from '@material-ui/icons';
import { ButtonMetricPicker, ButtonSchedulePicker } from '@plentyag/app-environment/src/common/components';
import { EVS_URLS } from '@plentyag/app-environment/src/common/utils';
import {
  DialogMetricPicker,
  DialogSchedulePicker,
  DraggableList,
  Show,
  useGlobalSnackbar,
} from '@plentyag/brand-ui/src/components';
import { UseMetricPickerFormGenValues } from '@plentyag/brand-ui/src/components/dialog-metric-picker/hooks';
import { UseSchedulePickerFormGenValues } from '@plentyag/brand-ui/src/components/dialog-schedule-picker/hooks';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { Widget, WidgetItem as WidgetItemType } from '@plentyag/core/src/types/environment';
import { getScopedDataTestIds, parseErrorMessage } from '@plentyag/core/src/utils';
import React from 'react';

import { WidgetItem } from './components';
import { useWidgetItemHandlers, UseWidgetItemHandlersReturn } from './hooks';
import { getButtonsState, GetButtonsState } from './utils';

const dataTestIds = getScopedDataTestIds(
  {
    title: 'title',
    close: 'close',
    content: 'content',
    save: 'save',
    loader: 'loader',
    info: 'info',
  },
  'dialog-widget-items'
);

export { dataTestIds as dataTestIdsDialogWidgetItems };

export interface DialogWidgetItems extends Omit<GetButtonsState, 'items'> {
  widget: Widget;
  open: boolean;
  onClose: () => void;
  onWidgetUpdated: (widget: Widget) => void;
  dataTestId?: string;
  alertRuleOnly?: boolean;
  renderAlertRule?: DialogMetricPicker['renderAlertRule'];
  chooseActionDefinitionKey?: DialogSchedulePicker['chooseActionDefinitionKey'];
  multiple?: ButtonSchedulePicker['multiple'];
}

/**
 * This Dialog lets the user manage the Metric and Schedules associated to a Widget as well as their order.
 */
export const DialogWidgetItems: React.FC<DialogWidgetItems> = ({
  widget,
  open,
  onClose,
  onWidgetUpdated,
  nonNumericalMetricLimit,
  metricLimit,
  scheduleLimit,
  scheduleOrAlertRuleOnly,
  alertRuleOnly,
  renderAlertRule,
  chooseActionDefinitionKey,
  multiple,
  dataTestId,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const { items, setItems, deleteItem, addItem, editItem } = useWidgetItemHandlers({ widget });
  const [editWidgetItem, setEditWidgetItem] = React.useState<WidgetItemType>();
  const { makeRequest } = usePutRequest<Widget, Widget>({ url: EVS_URLS.widgets.updateUrl(widget) });
  const snackbar = useGlobalSnackbar();
  const [coreStore] = useCoreStore();
  const username = coreStore.currentUser?.username;

  const getMetricOptions = (values: UseMetricPickerFormGenValues) =>
    renderAlertRule && values?.alertRule?.id ? { alertRuleId: values.alertRule.id } : undefined;
  const getScheduleOptions = (values: UseSchedulePickerFormGenValues) =>
    chooseActionDefinitionKey ? { actionDefinitionKey: values.actionDefinitionKey } : undefined;

  const handleEdit: UseWidgetItemHandlersReturn['editItem'] = (...args) => {
    editItem(...args);
    setEditWidgetItem(null);
  };

  const handleAddSchedules: ButtonSchedulePicker['onChange'] = values => {
    if (multiple) {
      values.schedules.forEach(schedule => addItem(schedule, getScheduleOptions(values)));
    } else {
      addItem(values.schedule, getScheduleOptions(values));
    }
  };

  const handleSave = () => {
    setIsLoading(true);

    makeRequest({
      data: { ...widget, items, updatedBy: username },
      onSuccess: response => {
        setIsLoading(false);
        snackbar.successSnackbar('Widget successfully updated.');
        onWidgetUpdated(response);
      },
      onError: error => {
        setIsLoading(false);
        const message = parseErrorMessage(error);
        snackbar.errorSnackbar({ message });
      },
    });
  };

  const handleClose = () => {
    setItems(widget.items);
    onClose();
  };

  const handleDrop: DraggableList<WidgetItemType>['onDrop'] = orderedItems => {
    if (isLoading) {
      return;
    }

    setItems(orderedItems);
  };

  const { isAddMetricDisabled, isAddScheduleDisabled } = getButtonsState({
    items,
    nonNumericalMetricLimit,
    metricLimit,
    scheduleLimit,
    scheduleOrAlertRuleOnly,
  });

  return (
    <Dialog disableEscapeKeyDown fullWidth maxWidth="lg" open={open} data-testid={dataTestId} onClose={handleClose}>
      <DialogTitle data-testid={dataTestIds.title}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">{widget.name}</Typography>
          <IconButton
            color="default"
            icon={Close}
            aria-label="close"
            onClick={handleClose}
            data-testid={dataTestIds.close}
          />
        </Box>
      </DialogTitle>
      <DialogContent data-testid={dataTestIds.content}>
        <Show when={!isLoading && items.length === 0}>
          <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" height="100%">
            <Box display="flex" marginBottom={2}>
              <ErrorOutline />
              <Box padding={0.25} />
              <Typography data-testid={dataTestIds.info}>
                No Metric or Schedule have been associated to this Widget yet.
              </Typography>
            </Box>
          </Box>
        </Show>
        <DraggableList<WidgetItemType>
          onDrop={handleDrop}
          listItems={items}
          listItemRenderer={widgetItem => (
            <WidgetItem item={widgetItem} onDelete={deleteItem} onEdit={setEditWidgetItem} disabled={isLoading} />
          )}
          targetIdentifier="widget-items"
        />
      </DialogContent>
      <DialogMetricPicker
        open={editWidgetItem?.itemType === 'METRIC'}
        metric={editWidgetItem?.metric}
        onClose={() => setEditWidgetItem(null)}
        onChange={values => handleEdit(editWidgetItem, values.metric, getMetricOptions(values))}
        renderAlertRule={renderAlertRule}
      />
      <DialogSchedulePicker
        open={editWidgetItem?.itemType === 'SCHEDULE'}
        schedule={editWidgetItem?.schedule}
        onClose={() => setEditWidgetItem(null)}
        onChange={values => handleEdit(editWidgetItem, values.schedule, getScheduleOptions(values))}
        chooseActionDefinitionKey={chooseActionDefinitionKey}
      />
      <Box display="flex" justifyContent="center" padding={2} gridGap="0.5rem">
        <ButtonMetricPicker
          onChange={values => addItem(values.metric, getMetricOptions(values))}
          disabled={isAddMetricDisabled || isLoading}
          renderAlertRule={renderAlertRule}
        />

        <Show when={!alertRuleOnly}>
          <ButtonSchedulePicker
            onChange={handleAddSchedules}
            disabled={isAddScheduleDisabled || isLoading}
            chooseActionDefinitionKey={chooseActionDefinitionKey}
            multiple={multiple}
          />
        </Show>

        <Button
          color="primary"
          variant="contained"
          startIcon={isLoading ? <CircularProgress size="12px" data-testid={dataTestIds.loader} /> : <Check />}
          onClick={handleSave}
          data-testid={dataTestIds.save}
          disabled={isLoading}
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};
