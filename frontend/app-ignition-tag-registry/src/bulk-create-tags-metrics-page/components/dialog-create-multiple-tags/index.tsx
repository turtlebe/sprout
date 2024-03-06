import { useMultiTagFormGenConfig } from '@plentyag/app-ignition-tag-registry/src/common/hooks';
import { BaseForm, DialogDefault } from '@plentyag/brand-ui/src/components';
import useCoreStore from '@plentyag/core/src/core-store';
import React from 'react';

interface DialogCreateMultipleTags {
  open: boolean;
  dataTestId: string;
  onClose: () => void;
  handleAddMultiTags: (value: unknown) => void;
}

const dataTestIds = {
  form: 'multi-tag-add-form',
  submit: 'multi-tag-add-form-submit',
  loader: 'multi-tag-add-form-loader',
};

export const DialogCreateMultipleTags: React.FC<DialogCreateMultipleTags> = ({
  open,
  dataTestId,
  onClose,
  handleAddMultiTags,
}) => {
  const [coreStore] = useCoreStore();
  const multiTagFormGenConfig = useMultiTagFormGenConfig({ username: coreStore.currentUser?.username });

  return (
    <DialogDefault open={open} onClose={onClose} data-testid={dataTestId} maxWidth="md" title="Add Multiple Tags">
      <BaseForm
        isUpdating={false}
        isLoading={false}
        onSubmit={handleAddMultiTags}
        formGenConfig={multiTagFormGenConfig}
        layout="default"
        renderSubmitTextHelper={false}
        dataTestIdProps={dataTestIds}
      />
    </DialogDefault>
  );
};
