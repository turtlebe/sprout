import { chooseFromAutocompleteByIndex, getInputByName, openAutocomplete } from '@plentyag/brand-ui/src/test-helpers';
import { mockUseFetchObservationGroups } from '@plentyag/core/src/hooks/use-fetch-observation-groups/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';

import { AutocompleteObservationGroup } from '../autocomplete-observation-group';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

mockUseFetchObservationGroups();

let formikProps;
const name = 'name';
const options = makeOptions({ formGenField: { name }, setFormikProps: f => (formikProps = f) });

describe('AutocompleteObservationGroup', () => {
  it('selects a Path', async () => {
    await renderFormGenInputAsync(AutocompleteObservationGroup, options());

    expect(getInputByName(name)).toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(name));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[name]).toBe('sites/SSF2');
  });

  it('selects a MeasurementType', async () => {
    await renderFormGenInputAsync(
      AutocompleteObservationGroup,
      options({
        formGenField: {
          level: 'measurementType',
          path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/Dehumidifier1',
        },
      })
    );

    expect(getInputByName(name)).toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(name));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[name]).toBe('FLOW_RATE');
  });

  it('selects an ObservationName', async () => {
    await renderFormGenInputAsync(
      AutocompleteObservationGroup,
      options({
        formGenField: {
          level: 'observationName',
          path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/Dehumidifier1',
          measurementType: 'FLOW_RATE',
        },
      })
    );

    expect(getInputByName(name)).toBeInTheDocument();

    await actAndAwait(() => openAutocomplete(name));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expect(formikProps.values[name]).toBe('CoolingCoilFlow');
  });
});
