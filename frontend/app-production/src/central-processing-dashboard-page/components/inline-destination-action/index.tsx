import {
  DropDown,
  MoveCarrier,
  MoveCarrierSerializers,
  useActionModule,
} from '@plentyag/app-production/src/actions-modules';
import { Show } from '@plentyag/brand-ui/src/components';
import { useCoreStore } from '@plentyag/core/src/core-store';
import { getScopedDataTestIds, getTowerDestinationFromPath } from '@plentyag/core/src/utils';
import { isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';

import { ACTION_PATH } from '../../constants';
import { BufferState } from '../../types/buffer-state';

import { InProgressStyled } from './styled';

const dataTestIds = getScopedDataTestIds(
  { currentDisplay: 'current-display', saving: 'saving' },
  'InlineDestinationAction'
);

export { dataTestIds as dataTestIdsInlineDestinationAction };

export interface InlineDestinationAction {
  isActive?: boolean;
  bufferCarrierState: BufferState;
  destinationKey: string;
  onAfterSubmitAsync?: () => Promise<any>;
}

export const InlineDestinationAction: React.FC<InlineDestinationAction> = ({
  isActive = false,
  bufferCarrierState,
  destinationKey,
  onAfterSubmitAsync = async () => Promise.resolve(),
}) => {
  const [coreState] = useCoreStore();
  const [isSaving, setIsSaving] = useState(false);
  const { actionModuleProps, handleSubmit, resetForm } = useActionModule({
    actionModule: MoveCarrier,
    path: ACTION_PATH,
    getDataModel: actionModel =>
      MoveCarrierSerializers.getDataModelFromBufferCarrierState(actionModel, bufferCarrierState, coreState),
  });

  const { formik, actionModel } = actionModuleProps;
  const isEditable = !isEmpty(formik.values);
  const currentValue = getTowerDestinationFromPath(bufferCarrierState[destinationKey]);
  const newValue = formik.dirty && formik.values['to_location']?.value;

  // any updates from the BE, reset the form
  useEffect(() => {
    resetForm();
  }, [currentValue]);

  // observe new value, and automatically save it
  useEffect(() => {
    if (newValue) {
      const execute = async () => {
        setIsSaving(true);

        // submit form, and after submit run callback and reset the form
        await handleSubmit()
          .then(() => {
            void onAfterSubmitAsync();
          })
          .catch(() => {
            setIsSaving(false);
            resetForm();
          });
      };
      void execute();
    }
  }, [newValue]);

  // a "waiting period" to stay in "saving" mode until the BE polls and returns the matching value
  useEffect(() => {
    if (isSaving && currentValue === newValue) {
      setIsSaving(false);
    }
  }, [isSaving, currentValue, newValue]);

  // saving state showing new value "in progress"
  if (isSaving && newValue) {
    return <InProgressStyled data-testid={dataTestIds.saving}>{newValue}</InProgressStyled>;
  }

  return (
    <Show when={isActive && isEditable} fallback={<span data-testid={dataTestIds.currentDisplay}>{currentValue}</span>}>
      <DropDown
        size="x-small"
        marginLeft={-14}
        minWidth="100%"
        field="to_location"
        formik={formik}
        actionModel={actionModel}
      />
    </Show>
  );
};
