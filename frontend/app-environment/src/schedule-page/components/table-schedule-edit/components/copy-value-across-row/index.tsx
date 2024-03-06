import { Check, Clear } from '@material-ui/icons';
import { getActionDefinitions, getActionInitialValue } from '@plentyag/app-environment/src/common/utils';
import { Box, Button } from '@plentyag/brand-ui/src/material-ui/core';
import { ScheduleDefinition } from '@plentyag/core/src/farm-def/types';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { ActionValueInput } from '../';

const dataTestIds = getScopedDataTestIds(
  {
    buttonCancelCopyValueAcrossRow: 'button-cancel-copy-across-row',
    buttonApplyCopyValueAcrossRow: 'button-apply-copy-across-row',
    cellCopyValueAcrossRow: 'cell-copy-value-across-row',
  },
  'table-schedule-edit'
);

export { dataTestIds as dataTestIdsCopyValueAcrossRow };

export interface CopyValueAcrossRow {
  scheduleDefinition: ScheduleDefinition;
  onCancel: () => void;
  onCopyActionValueAcrossRow: (actionValueForRow: String) => void;
}

export const CopyValueAcrossRow: React.FC<CopyValueAcrossRow> = ({
  scheduleDefinition,
  onCancel,
  onCopyActionValueAcrossRow,
}) => {
  const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);

  const [actionValueForRow, setActionValueForRow] = React.useState<String>(getActionInitialValue(actionDefinition));

  const handleCopyValues = () => {
    onCopyActionValueAcrossRow(actionValueForRow);
  };

  return (
    <Box display="flex" justifyContent="flex-end" gridGap="1rem">
      <ActionValueInput
        actionDefinition={actionDefinition}
        actionValue={actionValueForRow.toString()}
        onChangeActionValue={actionValue => setActionValueForRow(actionValue)}
        onBlurActionValue={actionValue => setActionValueForRow(actionValue)}
        data-testid={dataTestIds.cellCopyValueAcrossRow}
      />
      <Button
        variant="contained"
        color="default"
        startIcon={<Clear />}
        onClick={onCancel}
        data-testid={dataTestIds.buttonCancelCopyValueAcrossRow}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        startIcon={<Check />}
        onClick={handleCopyValues}
        data-testid={dataTestIds.buttonApplyCopyValueAcrossRow}
      >
        Copy
      </Button>
    </Box>
  );
};
