import { Check, Close, Help } from '@material-ui/icons';
import { useManualCreateEvent } from '@plentyag/app-lab-testing/src/common/hooks/use-manual-create-event';
import { Snackbar, useSnackbar } from '@plentyag/brand-ui/src/components/snackbar';
import { Box, CircularProgress, makeStyles, MenuItem, Portal, Select } from '@plentyag/brand-ui/src/material-ui/core';
import useCoreStore from '@plentyag/core/src/core-store';
import React from 'react';

import { Placeholder } from '../placeholder-renderer';

interface ManualStatusRenderer {
  value: {
    containerRef: React.MutableRefObject<HTMLDivElement>;
    onManualFieldChanged: () => void;
    status: boolean | null; // true if passed, false if failed, null --> undetermined
    labTestFieldName: string;
    labTestSampleId: string;
    hasEditPermissions: boolean;
  };
}

const useStyles = makeStyles(theme => ({
  selectRoot: {
    fontSize: 'inherit', // get font size from ag-grid.
  },
  select: {
    paddingTop: '1px',
    paddingBottom: '1px',
  },
  error: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.success.main,
  },
}));

/**
 * Renderer for test results that can be manually edited by user.
 * Provides user with a drop down menu allowing them to change to: pass, fail, undetermined.
 * See: https://plentyag.atlassian.net/browse/SD-6081
 */
export const ManualStatusRenderer: React.FC<ManualStatusRenderer> = ({ value: props }) => {
  const state = useCoreStore()[0];
  const classes = useStyles({});
  const { createEvent, isLoading, error } = useManualCreateEvent(props.onManualFieldChanged);
  const snackbarProps = useSnackbar();

  React.useEffect(() => {
    if (error && snackbarProps.errorSnackbar) {
      snackbarProps.errorSnackbar({
        message: `Error changing test status: ${error.toString()}. Please try again, otherwise contact FarmOS support.`,
      });
    }
  }, [error]);

  if (!props) {
    return <Placeholder />;
  }

  function onChange(event: React.ChangeEvent<{ name?: string; value: unknown }>) {
    const newValue = event.target.value === 'undetermined' ? null : event.target.value === 'true';
    if (props.status !== newValue && state.currentUser) {
      createEvent({
        plenty_username: state.currentUser.username,
        lab_test_manual_field_name: props.labTestFieldName,
        lab_test_manual_field_value: newValue,
        lab_test_sample_id: props.labTestSampleId,
      });
    }
  }
  const value = typeof props.status === 'boolean' ? props.status : 'undetermined';

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {/* using portal since we're in a ag-grid cell renderer has renderers in it's own react context */}
      <Portal container={props.containerRef.current}>
        <Snackbar {...snackbarProps} />
      </Portal>
      <Select
        disabled={!props.hasEditPermissions}
        className={classes.selectRoot}
        classes={{ select: classes.select }}
        value={value}
        onChange={onChange}
      >
        <MenuItem value="true">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Check className={classes.success} fontSize="small" />
            Pass
          </Box>
        </MenuItem>
        <MenuItem value="false">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Close className={classes.error} fontSize="small" />
            Fail
          </Box>
        </MenuItem>
        <MenuItem value="undetermined">
          <Box display="flex" flexDirection="row" alignItems="center">
            <Help className={classes.error} fontSize="small" />
            Undetermined
          </Box>
        </MenuItem>
      </Select>
      {isLoading && <CircularProgress size={'1rem'} color="primary" />}
    </Box>
  );
};
