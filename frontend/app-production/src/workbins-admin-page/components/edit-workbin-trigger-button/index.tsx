import { EditButton } from '@plentyag/brand-ui/src/components';
import React from 'react';

import { WorkbinTaskTrigger } from '../../../common/types/workspace';
import { useEditWorkbinTriggerFormGenConfig } from '../../hooks/use-edit-workbin-trigger-form-gen-config';

interface EditWorkbinTriggerButton {
  workbinTrigger?: WorkbinTaskTrigger;
  isUpdating: boolean;
  onEditSuccess: (isUpdating: boolean, groupId: string) => void;
}

function createEmptyTrigger(): WorkbinTaskTrigger {
  return {
    farm: null,
    ordering: {},
    groupId: null,
    groupName: null,
    workbin: null,
    description: null,
    createdAt: null,
    updatedAt: null,
  };
}

export const EditWorkbinTriggerButton: React.FC<EditWorkbinTriggerButton> = ({
  workbinTrigger,
  isUpdating,
  onEditSuccess,
}) => {
  const triggerToEdit = workbinTrigger || createEmptyTrigger();
  const updateWorkbinTriggerFormGenConfig = useEditWorkbinTriggerFormGenConfig(triggerToEdit, isUpdating);

  return (
    <EditButton
      formGenConfig={updateWorkbinTriggerFormGenConfig.config}
      isUpdating={isUpdating || updateWorkbinTriggerFormGenConfig.isLoadingDefinitions}
      disabled={isUpdating && !workbinTrigger}
      onSuccess={onEditSuccess}
    />
  );
};
