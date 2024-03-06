import { DialogProps } from '@plentyag/brand-ui/src/material-ui/core';
import { Can } from '@plentyag/core/src/components/can';
import React from 'react';

import { DialogBaseForm, DialogBaseFormProps } from '../dialog-base-form';

export interface EditResponse {
  name: string;
}

export interface DialogEdit extends DialogBaseFormProps<EditResponse> {
  formGenConfig: FormGen.Config;
  layout?: FormGen.Layout;
  isUpdating: boolean;
  initialValues?: any;
  maxWidth?: DialogProps['maxWidth'];
}

export const DialogEdit: React.FC<DialogEdit> = ({
  formGenConfig,
  layout,
  initialValues,
  isUpdating,
  onSuccess,
  onClose,
  open,
  maxWidth = 'md',
}) => {
  if (!open) {
    return null;
  }

  const permission = isUpdating ? formGenConfig.permissions?.update : formGenConfig.permissions?.create;

  return (
    <Can resource={permission.resource} level={permission?.level} onPermissionDenied={onClose}>
      <DialogBaseForm
        open={open}
        isUpdating={isUpdating}
        onClose={onClose}
        onSuccess={onSuccess}
        formGenConfig={formGenConfig}
        layout={layout}
        initialValues={initialValues}
        maxWidth={maxWidth}
      />
    </Can>
  );
};
