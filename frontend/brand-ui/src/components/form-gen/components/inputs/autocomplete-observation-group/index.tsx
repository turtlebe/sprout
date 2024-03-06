import { AutocompleteOptionWithCount } from '@plentyag/brand-ui/src/components/autocomplete-option-with-count';
import { useFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups';
import { getShortenedPath } from '@plentyag/core/src/utils';
import {
  buildAutocompleteOptionsFromTree,
  buildTreeForObservationGroups,
  duplicateGroupAtEachLevel,
} from '@plentyag/core/src/utils/observation-groups';
import { get } from 'lodash';
import React from 'react';

import { Autocomplete } from '../autocomplete';
import { memoWithFormikProps } from '../memo-with-formik-props';

export const AutocompleteObservationGroup = memoWithFormikProps<FormGen.FieldAutocompleteObservationGroup>(
  ({ formGenField, formikProps, ...props }) => {
    const { path, measurementType, level, autocompleteProps, ...otherFormGenFieldProps } = formGenField;
    const { observationGroups, isLoading } = useFetchObservationGroups();
    const treeObservationGroups = React.useMemo(() => {
      return observationGroups
        ? buildTreeForObservationGroups(duplicateGroupAtEachLevel(observationGroups))
        : { count: 0, children: {} };
    }, [observationGroups]);

    const options = React.useMemo(() => {
      if (!path) {
        return buildAutocompleteOptionsFromTree(treeObservationGroups);
      }

      if (!measurementType) {
        return buildAutocompleteOptionsFromTree(treeObservationGroups, [path]);
      }

      return buildAutocompleteOptionsFromTree(treeObservationGroups, [path, measurementType]);
    }, [treeObservationGroups, path, measurementType]);

    const formGenFieldAutocomplete: FormGen.FieldAutocomplete = {
      ...otherFormGenFieldProps,
      type: 'Autocomplete',
      options,
      autocompleteProps: {
        ...autocompleteProps,
        loading: isLoading,
        renderOption: option => (
          <AutocompleteOptionWithCount
            label={level === 'path' ? getShortenedPath(option.label, true) : option.label}
            count={get(option, 'count')}
            lastObservedAt={get(option, 'lastObservedAt')}
          />
        ),
      },
    };

    return <Autocomplete formGenField={formGenFieldAutocomplete} formikProps={formikProps} {...props} />;
  }
);
