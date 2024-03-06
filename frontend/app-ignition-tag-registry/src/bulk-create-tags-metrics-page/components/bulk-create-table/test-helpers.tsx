import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocomplete,
  chooseFromAutocompleteByIndex,
  chooseFromSelectByIndex,
  getInputByName,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import { BulkCreateTable } from '.';

export function renderBulkCreateTable() {
  return render(
    <MemoryRouter>
      <GlobalSnackbar>
        <BulkCreateTable />
      </GlobalSnackbar>
    </MemoryRouter>
  );
}

export function expectValues(
  namespace,
  {
    path = '',
    tagProvider = '',
    tagPath = '',
    measurementType = '',
    measurementUnit = '',
    measurementName = '',
    min = '',
    max = '',
  } = {}
) {
  expect(getInputByName(namespace + '.path')).toHaveValue(path);
  expect(getInputByName(namespace + '.tagProvider')).toHaveValue(tagProvider);
  expect(getInputByName(namespace + '.tagPath')).toHaveValue(tagPath);
  expect(getInputByName(namespace + '.measurementType')).toHaveValue(measurementType);
  expect(getInputByName(namespace + '.measurementUnit')).toHaveValue(measurementUnit);
  expect(getInputByName(namespace + '.measurementName')).toHaveValue(measurementName);
  expect(getInputByName(namespace + '.min')).toHaveValue(min);
  expect(getInputByName(namespace + '.max')).toHaveValue(max);
}

export interface ChangeValues {
  pathIndex: number;
  tagProviderIndex: number;
  tagPathIndex: number;
  measurementType: string;
  measurementUnitIndex: number;
  measurementName: string;
  min?: number;
  max?: number;
}

export async function changeValues(
  namePrefix,
  {
    pathIndex,
    tagProviderIndex,
    tagPathIndex,
    measurementType,
    measurementUnitIndex,
    measurementName,
    min,
    max,
  }: ChangeValues
) {
  await actAndAwait(() => openAutocomplete(namePrefix + '.path'));
  await actAndAwait(() => chooseFromAutocompleteByIndex(pathIndex));
  await actAndAwait(() => fireEvent.blur(getInputByName(namePrefix + '.path')));
  await actAndAwait(() => openSelect(namePrefix + '.tagProvider'));
  await actAndAwait(() => chooseFromSelectByIndex(tagProviderIndex));
  await actAndAwait(() => openAutocomplete(namePrefix + '.tagPath'));
  await actAndAwait(() => chooseFromAutocompleteByIndex(tagPathIndex));
  await actAndAwait(() => openAutocomplete(namePrefix + '.measurementType'));
  await actAndAwait(() => chooseFromAutocomplete(measurementType));
  await actAndAwait(() => openSelect(namePrefix + '.measurementUnit'));
  await actAndAwait(() => chooseFromSelectByIndex(measurementUnitIndex));
  await actAndAwait(() => changeTextField(namePrefix + '.measurementName', measurementName));
  if (min) {
    await actAndAwait(() => changeTextField(namePrefix + '.min', min));
  }
  if (max) {
    await actAndAwait(() => changeTextField(namePrefix + '.max', max));
  }
}
