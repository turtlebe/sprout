import {
  AllowedObjects,
  AutocompleteFarmDefObject as BrandUiAutocompleteFarmDefObject,
} from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object';
import { isEqual } from 'lodash';
import React from 'react';

import { useFormikProps } from '../hooks/use-formik-props';
import { useIsRequired } from '../hooks/use-is-required';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const AutocompleteFarmDefObject = memoWithFormikProps<FormGen.FieldAutocompleteFarmDefObject>(
  ({ formGenField, formikProps, ...props }) => {
    const { value, error, name, label } = useFormikProps(formikProps, formGenField);
    const [internalFarmDefObject, setInternalFarmDefObject] = React.useState<AllowedObjects>(null);
    const { decorateLabel } = useIsRequired(formGenField);

    const handleChange: BrandUiAutocompleteFarmDefObject['onChange'] = farmDefObject =>
      setInternalFarmDefObject(farmDefObject);
    // We only validate on blur because it takes multiple interaction for the user to find what they want.
    const handleBlur: BrandUiAutocompleteFarmDefObject['onBlur'] = () => formikProps.validateField(name);
    const handleClear: BrandUiAutocompleteFarmDefObject['onClear'] = () => formikProps.setFieldValue(name, null);
    let setFieldValueCalled = false;
    // When the internal farmDefObject changes, updates the formik values.
    React.useEffect(() => {
      if (internalFarmDefObject) {
        formikProps.setFieldValue(name, formGenField.onChange(internalFarmDefObject));
        setFieldValueCalled = true;
      }
    }, [internalFarmDefObject]);

    // When the formik value changes, updates the internal farmDefObject.
    React.useEffect(() => {
      // Within the same render we never want to execute those two useEffect one after the other.
      // This can happen if `BrandUiAutocompleteFarmDefObject` modifies the `internalFarmDefObject` but the `value`
      // from the `formikProps` didn't have time to refresh and re-render.
      if (
        !setFieldValueCalled &&
        internalFarmDefObject &&
        value &&
        !isEqual(value, formGenField.onChange(internalFarmDefObject))
      ) {
        setInternalFarmDefObject(value);
      }
    }, [value]);

    return (
      <BrandUiAutocompleteFarmDefObject
        {...formGenField.autocompleteProps}
        id={name}
        error={error}
        label={decorateLabel(label)}
        // use internalFarmDefObject.path because value can be something else than a path
        initialPath={internalFarmDefObject?.path ?? value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        onClear={handleClear}
        showContainerLocations={formGenField.showContainerLocations}
        showDeviceLocations={formGenField.showDeviceLocations}
        showScheduleDefinitions={formGenField.showScheduleDefinitions}
        showScheduleDefinitionParents={formGenField.showScheduleDefinitionParents}
        showObservationStats={formGenField.showObservationStats}
        closeWhenSelectingKinds={formGenField.closeWhenSelectingKinds}
        deviceTypes={formGenField.deviceTypes}
        compatibleScheduleDefinition={formGenField.compatibleScheduleDefinition}
        resolveScheduleDefinition={formGenField.resolveScheduleDefinition}
        {...props}
      />
    );
  }
);
