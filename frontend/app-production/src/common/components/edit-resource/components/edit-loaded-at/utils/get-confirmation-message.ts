import { getFormattedObjectValue } from '@plentyag/core/src/utils';

import { LoadedAtAttributesLabels } from '../../../hooks/use-edit-loaded-at-form-gen-config';
import { getEditableLoadAtAttributes } from '../../../utils/get-editable-loaded-at-attributes';

export const getConfirmationMessage = values => {
  const editableAttributes = getEditableLoadAtAttributes(values.originalObj.resourceState);

  const editableValues = editableAttributes.map(editableAttribute => {
    const { originalObj } = values;
    const oldValue = originalObj.resourceState?.materialAttributes?.[editableAttribute];
    const newValue = values?.[editableAttribute];
    return `${LoadedAtAttributesLabels[editableAttribute]} from ${getFormattedObjectValue(
      oldValue
    )} to ${getFormattedObjectValue(newValue)}`;
  });
  return `You are about to replace ${editableValues.join(' and ')}. Are you sure you want to proceed?`;
};
