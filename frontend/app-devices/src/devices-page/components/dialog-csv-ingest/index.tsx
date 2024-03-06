import {
  dataTestIdsDialogBaseForm,
  DialogBaseForm,
  DialogBaseFormProps,
} from '@plentyag/brand-ui/src/components/dialog-base-form';
import React from 'react';

import { useCsvIngestFormGenConfig } from './hooks/use-csv-ingest-form-gen-config';

export { dataTestIdsDialogBaseForm as dataTestIdsDialogCsvIngest };

export interface DialogCsvIngest extends DialogBaseFormProps {}

export const DialogCsvIngest: React.FC<DialogCsvIngest> = ({ open, onClose, onSuccess }) => {
  const formGenConfig = useCsvIngestFormGenConfig();

  return <DialogBaseForm open={open} onClose={onClose} onSuccess={onSuccess} formGenConfig={formGenConfig} />;
};
