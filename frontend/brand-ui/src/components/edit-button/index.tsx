import { DialogConfirmation } from '@plentyag/brand-ui/src/components';
import { Button, DialogProps } from '@plentyag/brand-ui/src/material-ui/core';
import React from 'react';
import { kebabCase } from 'voca';

import { DialogEdit, EditResponse } from '../dialog-edit';

const dataTestIds = {
  editButton: (title: string) => `${kebabCase(title)}-button`,
};

export { dataTestIds as dataTestIdsEditButton };

export interface CustomButtonComponentProps {
  handleClick: () => void;
  title: string;
  dataTestId: string;
  disabled?: boolean;
}

interface EditButton {
  formGenConfig: FormGen.Config;
  layout?: FormGen.Layout;
  isUpdating: boolean;
  confirmationMessage?: string; // if message provided, then confirmation will be shown.
  disabled?: boolean;
  initialValues?: any;
  maxWidth?: DialogProps['maxWidth'];
  onSuccess: (isUpdating: boolean, newItemName: string) => void;
  buttonComponent?: (props: CustomButtonComponentProps) => React.ReactNode; // custom button component
}

export const EditButton: React.FC<EditButton> = ({
  formGenConfig,
  layout,
  isUpdating,
  initialValues,
  maxWidth,
  confirmationMessage,
  disabled,
  onSuccess,
  buttonComponent,
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState<boolean>(false);
  const [isConfimDialogOpen, setIsConfirmDialogOpen] = React.useState<boolean>(false);

  function handleEditButtonClick() {
    if (confirmationMessage) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  }

  function handleConfirmation() {
    setIsConfirmDialogOpen(false);
    setIsDialogOpen(true);
  }

  function handleEditDialogClose() {
    setIsDialogOpen(false);
  }

  function handleEditSuccess(response: EditResponse) {
    setIsDialogOpen(false);
    onSuccess(isUpdating, response.name);
  }

  return (
    <>
      {Boolean(buttonComponent) ? (
        buttonComponent({
          handleClick: handleEditButtonClick,
          disabled,
          dataTestId: dataTestIds.editButton(formGenConfig.title),
          title: formGenConfig.title,
        })
      ) : (
        <Button
          variant="contained"
          disabled={disabled}
          data-testid={dataTestIds.editButton(formGenConfig.title)}
          onClick={handleEditButtonClick}
        >
          {formGenConfig.title}
        </Button>
      )}
      <DialogEdit
        formGenConfig={formGenConfig}
        layout={layout}
        isUpdating={isUpdating}
        open={isDialogOpen}
        onClose={handleEditDialogClose}
        onSuccess={handleEditSuccess}
        initialValues={initialValues}
        maxWidth={maxWidth}
      />
      {confirmationMessage && (
        <DialogConfirmation
          open={isConfimDialogOpen}
          title={confirmationMessage}
          cancelLabel="No"
          confirmLabel="Yes"
          onConfirm={handleConfirmation}
          onCancel={() => setIsConfirmDialogOpen(false)}
        />
      )}
    </>
  );
};
