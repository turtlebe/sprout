import React from 'react';

import { SelectField } from './select-field';

interface Props {
  className: string;
  labTestProviderFieldName: string;
  lastTestKindFieldName: string;
  labTestKind: string;
  labTestProvider: string;
  labTypeData: LT.LabTestType[];
  setFieldValue: LT.SetFieldValueType;
  disabled: boolean;
}
export const LabTestProvider: React.FC<Props> = React.memo(props => {
  // lab test provider
  let labTestProviderOptions: LT.SelectOptions = (props.labTypeData || []).map(datum => {
    return {
      label: datum.labTestProvider,
      value: datum.labTestProvider,
    };
  });
  // dedup
  labTestProviderOptions = labTestProviderOptions.filter(
    (v, i) => labTestProviderOptions.findIndex(i => i.label === v.label) === i
  );

  let updatedLabTestProviderOptions = labTestProviderOptions;
  // if we have lab test kind but not provider then narrow provider options.
  if (props.labTestKind && !props.labTestProvider) {
    updatedLabTestProviderOptions = labTestProviderOptions.filter(option =>
      props.labTypeData.some(
        labTypeItem => labTypeItem.labTestProvider === option.value && labTypeItem.labTestKind === props.labTestKind
      )
    );
  }

  const handleLabTestProviderChange = React.useCallback(
    (labTestProvider: string) => {
      if (props.labTestKind) {
        const selectLabTypeItem = props.labTypeData
          ? props.labTypeData.find(
              data => data.labTestKind === props.labTestKind && data.labTestProvider === labTestProvider
            )
          : undefined;
        if (!selectLabTypeItem) {
          // no match
          props.setFieldValue(props.lastTestKindFieldName, '');
        }
      }
      props.setFieldValue(props.labTestProviderFieldName, labTestProvider);
    },
    [props.labTestProvider, props.labTestKind, props.labTypeData, props.setFieldValue, props.labTestProviderFieldName]
  );

  return (
    <SelectField
      className={props.className}
      fieldName={props.labTestProviderFieldName}
      options={updatedLabTestProviderOptions}
      label="Lab Provider"
      onChange={handleLabTestProviderChange}
      disabled={props.disabled}
    />
  );
});
