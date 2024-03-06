import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { CAN_NOT_RENDER_ERROR } from '../../utils';

import { dataTestIdsRecipeTable as dataTestIds, RecipeTable } from '.';

describe('RecipeTableCard', () => {
  it('renders table', () => {
    const consoleError = mockConsoleError();

    const recipeName = 'propIrrigationSchedule';
    const recipeSettings = {
      '1': 300,
      '2': { value: 250, units: 'liters' },
      '3': { value: 300 }, // missing units, will generate error
    };
    const { queryByTestId } = render(
      <RecipeTable
        title={recipeName}
        tableKeyHeaderName="day"
        tableValueHeaderName="volume"
        // @ts-ignore
        recipe={recipeSettings}
      />
    );

    expect(queryByTestId(dataTestIds.headerKeyName)).toHaveTextContent('day');
    expect(queryByTestId(dataTestIds.headerValueName)).toHaveTextContent('volume');

    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.tableRowKey('1'))).toHaveTextContent('1');
    expect(queryByTestId(dataTestIds.tableRowValue('1'))).toHaveTextContent('300');
    expect(queryByTestId(dataTestIds.tableRowKey('2'))).toHaveTextContent('2');
    expect(queryByTestId(dataTestIds.tableRowValue('2'))).toHaveTextContent('250 liters');

    expect(queryByTestId(dataTestIds.tableRowKey('3'))).toHaveTextContent('3');
    expect(queryByTestId(dataTestIds.tableRowValue('3'))).toHaveTextContent(CAN_NOT_RENDER_ERROR);
    expect(consoleError).toHaveBeenCalled();
  });
});
