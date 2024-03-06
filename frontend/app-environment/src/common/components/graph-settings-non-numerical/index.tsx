import { Close, Settings } from '@material-ui/icons';
import { Dropdown, DropdownItem, DropdownItemText, Show } from '@plentyag/brand-ui/src/components';
import { Box, CircularProgress, IconButton, TextField, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { DataInterpolation } from '@plentyag/core/src/types/environment';
import { isKeyPressed } from '@plentyag/core/src/utils';
import React from 'react';

import { DropdownTimeGranularity } from '..';
import { dataInterpolations, timeGranularitiesNonNumerical } from '../../utils/constants';

import { useStyles } from './styles';

const dataTestIds = {
  loader: 'graph-settings-loader',
  open: 'graph-settings-open',
  close: 'graph-settings-close',
  advancedValue: 'graph-settings-advanced-value',
  dataInterpolation: 'data-interpolation',
  dataInterpolationStep: (stepName: string) => `data-interpolation-step-${stepName}`,
};

export { dataTestIds as dataTestIdsGraphSettingsNonNumerical };

export interface GraphSettingsNonNumerical {
  isLoading: boolean;
  valueAttribute?: string;
  dataInterpolation: DataInterpolation;
  startDateTime: DropdownTimeGranularity['startDateTime'];
  endDateTime: DropdownTimeGranularity['endDateTime'];
  timeGranularity: DropdownTimeGranularity['timeGranularity'];
  onTimeGranularityChange: DropdownTimeGranularity['onChange'];
  onValueAttributeChange?: (valueAttriube: string) => void;
  onDataInterpolationChange?: (dataInterpolation: DataInterpolation) => void;
  right?: string;
  downloadIcon?: React.ReactNode;
}

/**
 * Settings of the Graph, currently this allows to conrol the Time Interval of the
 * data displayed on the graph.
 */
export const GraphSettingsNonNumerical: React.FC<GraphSettingsNonNumerical> = ({
  children,
  downloadIcon,
  isLoading,
  valueAttribute,
  dataInterpolation,
  startDateTime,
  endDateTime,
  timeGranularity,
  onValueAttributeChange,
  onTimeGranularityChange,
  onDataInterpolationChange,
  right = '0.5rem',
}) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState<boolean>(false);
  const [localValueAttribute, setLocalValueAttribute] = React.useState(valueAttribute);
  const [localDataInterpolation, setLocalDataInterpolation] = React.useState(dataInterpolation);

  React.useEffect(() => {
    setLocalValueAttribute(valueAttribute);
    setLocalDataInterpolation(dataInterpolation);
  }, [valueAttribute, dataInterpolation]);

  const Loader = ({ isLoading }) => (
    <Show when={isLoading}>
      <CircularProgress size="16px" data-testid={dataTestIds.loader} />
    </Show>
  );

  const handleValueAttributeChange: TextFieldProps['onChange'] = event => {
    setLocalValueAttribute(event.currentTarget.value || undefined);
  };

  const handleKeyDown: TextFieldProps['onKeyDown'] = event => {
    const { isEnterPressed } = isKeyPressed(event);
    if (isEnterPressed) {
      onValueAttributeChange(localValueAttribute);
    }
  };

  const handleDataInterpolationChange = (currentDataInterpolation: DataInterpolation) => {
    if (localDataInterpolation.value === currentDataInterpolation.value) {
      return;
    }

    setLocalDataInterpolation(currentDataInterpolation);
    onDataInterpolationChange(currentDataInterpolation);
  };

  return (
    <>
      <Box style={{ position: 'absolute', right, top: '0.5rem' }} display="flex" alignItems="center">
        <Loader isLoading={isLoading} />
        {downloadIcon}
        <IconButton color="default" icon={Settings} onClick={() => setOpen(true)} data-testid={dataTestIds.open} />
      </Box>
      <Box className={classes.settingsOverlay} hidden={!open}>
        <Box display="flex" alignItems="center" justifyContent="flex-end" paddingBottom={1}>
          <Loader isLoading={isLoading} />
          <IconButton color="default" icon={Close} onClick={() => setOpen(false)} data-testid={dataTestIds.close} />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1}>
          <Typography>Time Interval:</Typography>
          <DropdownTimeGranularity
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            timeGranularity={timeGranularity}
            timeGranularities={timeGranularitiesNonNumerical}
            onChange={onTimeGranularityChange}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1}>
          <Typography>Advanced Value:</Typography>
          <TextField
            data-testid={dataTestIds.advancedValue}
            variant="outlined"
            size="small"
            value={localValueAttribute || ''}
            onChange={handleValueAttributeChange}
            onKeyDown={handleKeyDown}
          />
        </Box>

        <Box display="flex" alignItems="center" justifyContent="space-between" paddingBottom={1}>
          <Typography>Data Interpolation:</Typography>
          <Dropdown
            color="default"
            variant="outlined"
            label={localDataInterpolation.label}
            data-testid={dataTestIds.dataInterpolation}
          >
            {dataInterpolations.map(dataInterpolation => (
              <DropdownItem
                key={dataInterpolation.value}
                onClick={() => handleDataInterpolationChange(dataInterpolation)}
                data-testid={dataTestIds.dataInterpolationStep(dataInterpolation.value)}
              >
                <DropdownItemText>{dataInterpolation.label}</DropdownItemText>
              </DropdownItem>
            ))}
          </Dropdown>
        </Box>

        {children}
      </Box>
    </>
  );
};
