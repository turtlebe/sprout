import { Add, Edit } from '@material-ui/icons';
import { EditButton } from '@plentyag/brand-ui/src/components';
import { IconButton, Tooltip, Typography } from '@plentyag/brand-ui/src/material-ui/core';
import { getScopedDataTestIds } from '@plentyag/core/src/utils';
import React from 'react';

import { IrrigationTaskTableRowData } from '../../types';

import { useFormGenConfig } from './hooks/use-form-gen-config';

const dataTestIds = getScopedDataTestIds(
  {
    modifyOrAddTaskButton: (isModify: boolean) => `${isModify ? 'modify' : 'add'}-task-button`,
  },
  'irrigation-actions'
);

export { dataTestIds as dataTestIdsModifyOrAddTaskButton };

export interface ModifyOrAddTaskButton {
  rowData: IrrigationTaskTableRowData;
  isModify: boolean;
  onRefreshIrrigationTasks: () => void;
}

export const ModifyOrAddTaskButton: React.FC<ModifyOrAddTaskButton> = ({
  rowData,
  isModify,
  onRefreshIrrigationTasks,
}) => {
  const formGenConfig = useFormGenConfig({
    rowData,
    isUpdating: isModify,
  });

  return (
    <EditButton
      formGenConfig={formGenConfig}
      isUpdating={isModify}
      onSuccess={onRefreshIrrigationTasks}
      buttonComponent={({ handleClick }) => (
        <Tooltip arrow title={<Typography>{isModify ? 'Modify' : 'Add'} irrigation task</Typography>}>
          <IconButton
            data-testid={dataTestIds.modifyOrAddTaskButton(isModify)}
            onClick={handleClick}
            color="default"
            size="small"
            icon={isModify ? Edit : Add}
          />
        </Tooltip>
      )}
    />
  );
};
