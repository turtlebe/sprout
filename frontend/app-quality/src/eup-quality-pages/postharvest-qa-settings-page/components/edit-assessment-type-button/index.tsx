import EditIcon from '@material-ui/icons/Edit';
import { AssessmentTypes } from '@plentyag/app-quality/src/eup-quality-pages/postharvest-qa-page/types';
import { EditButton, Show } from '@plentyag/brand-ui/src/components';
import { IconButton } from '@plentyag/brand-ui/src/material-ui/core';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { PermissionLevels, Resources } from '@plentyag/core/src/core-store/types';
import React from 'react';

import { useEditAssessmentTypeFormGenConfig } from '../../hooks/use-edit-assessment-type-form-gen-config';

import { useStyles } from './styles';

export interface EditAssessmentTypeButton {
  onSuccess: () => void;
  uiOrder?: number;
  assessmentType?: AssessmentTypes;
}

export const EditAssessmentTypeButton: React.FC<EditAssessmentTypeButton> = ({
  onSuccess = () => {},
  uiOrder,
  assessmentType,
}) => {
  const classes = useStyles({});

  const [{ currentUser }] = useCoreStore();
  const { username } = currentUser;

  const isUpdating = Boolean(assessmentType);

  const hasPermission = currentUser.hasPermission(Resources.HYP_QUALITY, PermissionLevels.EDIT);

  const formGenConfig = useEditAssessmentTypeFormGenConfig({
    assessmentTypeId: assessmentType?.id,
    uiOrder: assessmentType?.uiOrder ?? uiOrder,
    username,
  });

  const toDisable = Boolean(!formGenConfig);

  return (
    <Show when={hasPermission}>
      <EditButton
        formGenConfig={formGenConfig}
        isUpdating={isUpdating}
        initialValues={assessmentType}
        disabled={toDisable}
        onSuccess={onSuccess}
        buttonComponent={
          isUpdating
            ? ({ handleClick, title, dataTestId }) => (
                <IconButton
                  className={classes.button}
                  aria-label={title}
                  data-testid={dataTestId}
                  icon={EditIcon}
                  onClick={handleClick}
                />
              )
            : undefined
        }
      />
    </Show>
  );
};
