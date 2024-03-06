import React from 'react';

import { SelectField } from './select-field';

interface Props {
  className: string;
  labTestProviderFieldName: string;
  lastTestKindFieldName: string;
  validate: (value: string) => any;
  labTestKind: string;
  labTestProvider: string;
  labTypeData: LT.LabTestType[];
  setFieldValue: LT.SetFieldValueType;
  disabled: boolean;
}
export const LabTestKind: React.FC<Props> = React.memo(props => {
  // lab test types
  let labTestKindOptions: LT.SelectOptions = (props.labTypeData || []).map(datum => {
    return {
      label: datum.labTestKind,
      value: datum.labTestKind,
    };
  });
  // dedup
  labTestKindOptions = labTestKindOptions.filter(
    (v, i) => labTestKindOptions.findIndex(i => i.label === v.label) === i
  );

  let updatedLabTestKindOptions = labTestKindOptions;
  // if we have provider but not test type then narrow test type options.
  if (props.labTestProvider && !props.labTestKind) {
    updatedLabTestKindOptions = labTestKindOptions.filter(option =>
      props.labTypeData.some(
        labTypeItem => labTypeItem.labTestKind === option.value && labTypeItem.labTestProvider === props.labTestProvider
      )
    );
  }
  const handleLabTestKindChange = React.useCallback(
    (labTestKind: string) => {
      if (props.labTestProvider) {
        const selectLabTypeItem = props.labTypeData
          ? props.labTypeData.find(
              data => data.labTestKind === labTestKind && data.labTestProvider === props.labTestProvider
            )
          : undefined;
        if (!selectLabTypeItem) {
          // no match
          props.setFieldValue(props.labTestProviderFieldName, '');
        }
      }
      props.setFieldValue(props.lastTestKindFieldName, labTestKind);
    },
    [props.labTestKind, props.labTestProvider, props.labTypeData, props.setFieldValue, props.lastTestKindFieldName]
  );

  return (
    <SelectField
      className={props.className}
      fieldName={props.lastTestKindFieldName}
      options={updatedLabTestKindOptions}
      label="Lab Test Type"
      validate={props.validate}
      onChange={handleLabTestKindChange}
      disabled={props.disabled}
    />
  );
});
