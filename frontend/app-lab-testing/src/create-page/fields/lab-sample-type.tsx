import React from 'react';

import { AutocompleteField } from './autocomplete-field';

interface Props {
  className: string;
  labSampleTypeFieldName: string;
  labTestKind: string;
  labTestProvider: string;
  labTypeData: LT.LabTestType[];
  setFieldValue: LT.SetFieldValueType;
  disabled: boolean;
}
export const LabSampleType: React.FC<Props> = React.memo(props => {
  const labSampleOptions = React.useMemo(() => {
    if (props.labTestKind && props.labTestProvider) {
      const selectedItem = props.labTypeData.find(
        data => data.labTestKind === props.labTestKind && data.labTestProvider === props.labTestProvider
      );
      if (selectedItem) {
        const labSampleOptions = Array.from(selectedItem.schemaSubmissionFormBySampleType.keys());
        return labSampleOptions;
      }
    }
    return [];
  }, [props.labTestKind, props.labTestProvider, props.labTestProvider]);

  React.useEffect(() => {
    if (!props.labTestKind || !props.labTestProvider) {
      // emtpy field if neither lab provider or kind provided.
      props.setFieldValue(props.labSampleTypeFieldName, '');
    }
  }, [props.labTestKind, props.labTestProvider, props.setFieldValue, props.labSampleTypeFieldName]);

  let noOptionsText = 'No options';
  if (!props.labTestKind || !props.labTestProvider) {
    noOptionsText = 'No Sample Types, please select Lab Test Type and Lab Provider';
  }

  return (
    <AutocompleteField
      multiple={false}
      disabled={props.disabled}
      className={props.className}
      label="Sample Type"
      fieldName={props.labSampleTypeFieldName}
      options={labSampleOptions}
      noOptionsText={noOptionsText}
    />
  );
});
