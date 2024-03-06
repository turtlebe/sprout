import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsRecipeFactory } from '../..';

import { dataTestIdsRecipeList as dataTestIds, RecipeList } from '.';

describe('RecipeListCard', () => {
  it('renders list of settings card', () => {
    const consoleError = mockConsoleError();

    const recipe = {
      // four single settings items
      dibbleDepth: 11.0,
      irrigatorConveyorSpeed: { units: 'm/s', value: 2 },
      topCoaterVibrationIntensity: '20.1',
      lightsOn: true,
      // table
      irrigationSchedule: {
        '0': 210,
        '10': 210,
      },
      badSetting: {}, // error, invalid setting
    };

    // @ts-ignore
    const { queryByTestId, queryAllByTestId } = render(<RecipeList title={'list'} recipe={recipe} />);

    expect(queryByTestId(dataTestIds.root).children).toHaveLength(Object.keys(recipe).length);

    // should render four single settings items: dibbleDepth, irrigatorConveyorSpeed, topCoaterVibrationIntensity and lightsOn
    const singleSettings = queryAllByTestId(dataTestIdsRecipeFactory.singleSetting);
    expect(singleSettings).toHaveLength(4);

    // should render table: irrigationSchedule
    const table = queryAllByTestId(dataTestIdsRecipeFactory.table);
    expect(table).toHaveLength(1);

    // should render error for "badSetting"
    const error = queryAllByTestId(dataTestIdsRecipeFactory.error);
    expect(error).toHaveLength(1);
    expect(consoleError).toHaveBeenCalled();
  });
});
