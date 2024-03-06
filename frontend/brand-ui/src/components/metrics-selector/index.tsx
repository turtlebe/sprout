import { Close } from '@material-ui/icons';
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@plentyag/brand-ui/src/material-ui/core';
import { Metric } from '@plentyag/core/src/types/environment';
import React from 'react';

import { AutocompleteFarmDefObject } from '../autocomplete-farm-def-object';

import { AutocompleteMetrics, TransferList } from './components';
import { useSearchMetrics, useSelectedMetrics } from './hooks';

const dataTestIds = {
  autocompleteFarmDefObject: 'metrics-selector-autocomplete-farm-def-object',
  dialog: 'metrics-selector-dialog',
  close: 'metrics-selector-close',
};

export { dataTestIds as dataTestIdsMetricsSelector };

export interface MetricsSelector {
  id?: string;
  label?: string;
  error?: string;
  onChange?: (metricIds: string[]) => void;
  onCloseDialog?: () => void;
  metricIds?: string[];
}

/**
 * Allow users to choose one or many Metrics.
 *
 * We use an Autocomplete to show which Metrics are currently chosen, however we don't use any Autocomplete functionality
 * to pick Metrics. Instead we use a Modal with an AutocompleteFarmDefObject and a TransferList.
 *
 * When opening the Modal, the user can lookup Metrics for a given path. He can then choose via a TransferList which
 * Metrics to pick.
 */
export const MetricsSelector: React.FC<MetricsSelector> = ({
  id,
  label,
  error,
  metricIds,
  onChange = () => {},
  onCloseDialog = () => {},
}) => {
  const [path, setPath] = React.useState<string>();
  const {
    metrics: selectedMetrics,
    setMetrics: setSelectedMetrics,
    isLoading: isLoadingSelectedMetrics,
  } = useSelectedMetrics({ metricIds });
  const [open, setOpen] = React.useState<boolean>(false);
  const { data: metrics, isValidating } = useSearchMetrics({ path });

  const isLoading = isValidating || isLoadingSelectedMetrics;

  const handleChange = (metrics: Metric[]) => {
    setSelectedMetrics(metrics);
    onChange(metrics.map(metric => metric.id));
  };

  const handleClose = () => {
    setOpen(false);
    onCloseDialog();
  };

  return (
    <>
      <AutocompleteMetrics
        id={id}
        label={label}
        error={error}
        value={selectedMetrics}
        isLoading={isLoading}
        onRemove={handleChange}
        onOpen={() => setOpen(true)}
        onClear={() => setSelectedMetrics([])}
      />
      <Dialog open={open} maxWidth="md" fullWidth data-testid={dataTestIds.dialog}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Choose Metrics:</Typography>
            <IconButton
              color="default"
              icon={Close}
              aria-label="close"
              onClick={handleClose}
              data-testid={dataTestIds.close}
            />
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box>
            <AutocompleteFarmDefObject
              id={dataTestIds.autocompleteFarmDefObject}
              onChange={object => setPath(object.path)}
            />
            <Box padding={1} />
            <TransferList options={metrics?.data || []} selected={selectedMetrics} onChange={handleChange} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
