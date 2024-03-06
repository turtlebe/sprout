import { EditButton } from '@plentyag/brand-ui/src/components';
import React from 'react';

import { WorkbinTaskDefinition } from '../../../common/types/workspace';
import { useEditTaskDefinitionFormGenConfig } from '../../hooks/use-edit-task-definition-form-gen-config';

interface EditTaskDefinitionButton {
  taskDefinition?: WorkbinTaskDefinition;
  isUpdating: boolean;
  onEditSuccess: (isUpdating: boolean, taskDefinitionId: string) => void;
}

function createEmptyDefinition(): WorkbinTaskDefinition {
  return {
    id: null,
    shortTitle: null,
    farm: null, // TODO: Get from current user
    title: null,
    description: '',
    sopLink: '',
    priority: 'REGULAR',
    groups: [],
    workbins: [],
    fields: [],
    createdAt: null,
    updatedAt: null,
    scheduled: false,
    definitionCreatedByInternalService: false,
  };
}

export const EditTaskDefinitionButton: React.FC<EditTaskDefinitionButton> = ({
  taskDefinition,
  isUpdating,
  onEditSuccess,
}) => {
  const definitionToEdit = taskDefinition || createEmptyDefinition();
  const updateCropFormGenConfig = useEditTaskDefinitionFormGenConfig(definitionToEdit, isUpdating);

  return (
    <EditButton
      formGenConfig={updateCropFormGenConfig}
      isUpdating={isUpdating}
      disabled={isUpdating && !taskDefinition}
      onSuccess={onEditSuccess}
      initialValues={definitionToEdit}
    />
  );
};
