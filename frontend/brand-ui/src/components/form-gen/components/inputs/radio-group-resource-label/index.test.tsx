import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { ContainerTypes, MaterialTypes } from '@plentyag/core/src/types';

import { dataTestIds } from '../radio-group';
import { makeOptions, renderFormGenInputAsync } from '../test-helpers';

import { CONTAINER_LABEL, MATERIAL_LABEL, RadioGroupResourceLabel } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

// mock backend that will return appropriate types based on url query params.
mockUseSwrAxios.mockImplementation((params: { url: string }) => {
  const parts = params.url.split('?');
  const search = parts[parts.length - 1];
  const query = new URLSearchParams(search);

  const data = [];

  if (query.has('materialType')) {
    data.push({
      name: 'Chlorosis',
      description: 'Chlorosis',
      resourceTypes: ['LOADED_TOWER'],
      labelCategories: ['PLANT_HEALTH'],
      labelType: 'MATERIAL',
    });
  }

  if (query.has('containerType')) {
    data.push({
      name: 'Automatic Duplicate Barcode Detection',
      description: 'Automatic Duplicate Barcode Detection',
      resourceTypes: ['TOWER'],
      labelCategories: ['CONTAINER_OBSERVATION'],
      labelType: 'CONTAINER',
    });
  }

  return { data };
});

describe('RadioGroupResourceLabel', () => {
  async function renderRadioGroupResourceLabel(
    containerType?: ContainerTypes,
    materialType?: MaterialTypes,
    existingLabels?: string[]
  ) {
    const options = makeOptions({});

    const [{ getAllByTestId }] = await renderFormGenInputAsync(
      RadioGroupResourceLabel,
      options({ formGenField: { containerType, materialType, existingLabels } })
    );

    return getAllByTestId;
  }

  it('gets container label types', async () => {
    const getAllByTestId = await renderRadioGroupResourceLabel('TOWER');

    const categories = getAllByTestId(dataTestIds.category);
    expect(categories).toHaveLength(1);
    expect(categories[0]).toHaveTextContent(CONTAINER_LABEL);
  });

  it('gets material label types', async () => {
    const getAllByTestId = await renderRadioGroupResourceLabel(undefined, 'LOADED_TOWER');

    const categories = getAllByTestId(dataTestIds.category);
    expect(categories).toHaveLength(1);
    expect(categories[0]).toHaveTextContent(MATERIAL_LABEL);
  });

  it('gets both material and container label types', async () => {
    const getAllByTestId = await renderRadioGroupResourceLabel('TOWER', 'LOADED_TOWER');

    const categories = getAllByTestId(dataTestIds.category);
    expect(categories).toHaveLength(2);
    expect(categories[0]).toHaveTextContent(CONTAINER_LABEL);
    expect(categories[1]).toHaveTextContent(MATERIAL_LABEL);
  });

  it('filters out existing labels', async () => {
    const getAllByTestId = await renderRadioGroupResourceLabel('TOWER', 'LOADED_TOWER', [
      'Automatic Duplicate Barcode Detection',
    ]);

    // should only have one label since existing labels include only item in container list.
    const categories = getAllByTestId(dataTestIds.category);
    expect(categories).toHaveLength(1);
    expect(categories[0]).toHaveTextContent(MATERIAL_LABEL);
  });
});
